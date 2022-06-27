import { useState, useEffect, createContext } from "react";
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import io from "socket.io-client";

let socket;

const contextProjects = createContext();

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState([]);
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalFormTask, setmodalFormTask] = useState(false);
  const [task, setTask] = useState({});
  const [modalEraseTask, setModalEraseTask] = useState(false);
  const [colab, setColab] = useState({});
  const [deleteColabModal, setDeleteColabModal] = useState(false);
  const [search, setSearch] = useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();

  // Sockets IO
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axiosClient("/projects", config);
        setProjects(data);
      } catch (error) {}
    };
    getProjects();
  }, [auth]);

  // Projects

  // Show Project
  const showAlert = (alert) => {
    setAlert(alert);

    setTimeout(() => {
      setAlert({});
    }, 5000);
  };

  // Submit Project
  const submitProject = async (project) => {
    if (project.id) {
      await editProject(project);
    } else {
      await createProject(project);
    }
  };

  // Create Project
  const createProject = async (project) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.post("/projects", project, config);

      setProjects([...projects, data]);

      setAlert({
        msg: "Project created succesfully",
        error: false,
      });

      setTimeout(() => {
        setAlert({});
        navigate("/projects");
      }, 3000);
    } catch (error) {}
  };

  // Edit Project
  const editProject = async (project) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.put(
        `/projects/${project.id}`,
        project,
        config
      );

      // Sync the state
      const updatedProjects = projects.map((projectState) =>
        projectState._id === data._id ? data : projectState
      );
      setProjects(updatedProjects);

      // Show the alert
      setAlert({
        msg: "Project Updated Succesfully",
        error: false,
      });

      setTimeout(() => {
        setAlert({});
        navigate("/projects");
      }, 3000);

      // Redirect
    } catch (error) {}
  };

  // Get Project
  const getProject = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient(`/projects/${id}`, config);
      setProject(data);
      setAlert({});
    } catch (error) {
      navigate("/projects");
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Erase Project
  const eraseProject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.delete(`/projects/${id}`, config);

      // Sync the state
      const updatedProjects = projects.filter(
        (projectState) => projectState._id !== id
      );
      setProjects(updatedProjects);

      setAlert({
        msg: data.msg,
        error: false,
      });

      setTimeout(() => {
        setAlert({});
        navigate("/projects");
      }, 3000);
    } catch (error) {}
  };

  // Tasks

  // Show modal Task
  const handleModalTask = () => {
    setmodalFormTask(!modalFormTask);
    setTask({});
  };

  // Submit task
  const submitTask = async (task) => {
    if (task?.id) {
      await editTask(task);
    } else {
      await createTask(task);
    }
  };

  // Create Task
  const createTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post("/tasks", task, config);

      setAlert({});
      setmodalFormTask(false);

      // Socket IO
      socket.emit("new task", data);
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Task
  const editTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.put(`/tasks/${task.id}`, task, config);

      setAlert({});
      setmodalFormTask(false);
      // Socket IO
      socket.emit("edit task", data);
    } catch (error) {
      console.log(error);
    }
  };

  // Erase Task
  const eraseTask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.delete(`/tasks/${task._id}`, config);
      setAlert({ msg: data.msg, error: false });
      setModalEraseTask(false);

      // Socket IO
      socket.emit("delete task", task);

      setTask({});
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  // Show modal Edit Task
  const handleModalEditTask = async (task) => {
    setTask(task);
    setmodalFormTask(true);
  };

  // Show modal Erase Task
  const handleModalEraseTask = async (task) => {
    setTask(task);
    setModalEraseTask(!modalEraseTask);
  };

  // Complete task
  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/tasks/status/${id}`,
        {},
        config
      );

      setTask({});
      setAlert({});

      // Socket IO
      socket.emit("complete task", data);
    } catch (error) {
      console.log(error);
    }
  };

  // Submit tasks project from the Socket IO
  const submitTasksSocket = (task) => {
    // Sync the state
    const updatedProject = { ...project };
    updatedProject.tasks = [...project.tasks, task];
    setProject(updatedProject);
  };

  // Delete task project from the Socket IO
  const deleteTaskSocket = (task) => {
    // Sync the state
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.filter(
      (taskState) => taskState._id !== task._id
    );
    setProject(updatedProject);
  };

  // Edit task project from the Socket IO
  const editedTaskSocket = (task) => {
    // Sync the state
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.map((taskState) =>
      taskState._id === task._id ? task : taskState
    );
    setProject(updatedProject);
  };

  // Complete task project from the Socket IO
  const completedTaskSocket = (task) => {
    // Sync the state
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.map((taskState) =>
      taskState._id === task._id ? task : taskState
    );
    setProject(updatedProject);
  };

  // Colabs

  // Submit colab
  const submitColab = async (email) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/projects/colabs`,
        { email },
        config
      );

      setColab(data);
      setAlert({});
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Add Colab
  const addColab = async (colab) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/projects/colabs/${project._id}`,
        colab,
        config
      );

      setAlert({
        msg: data.msg,
        error: false,
      });
      setColab({});
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    }
  };

  // Handle Modal Colab
  const handleModalDeleteColab = async (colab) => {
    setColab(colab);
    setDeleteColabModal(!deleteColabModal);
  };

  // Delete Colab
  const deleteColab = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/projects/colabs-delete/${project._id}`,
        colab,
        config
      );

      // Sync State
      const updatedProject = { ...project };

      updatedProject.colaborators = updatedProject.colaborators.filter(
        (colbaboratorState) => colbaboratorState._id !== colab._id
      );

      setProject(updatedProject);
      setAlert({
        msg: data.msg,
        error: false,
      });
      setColab({});
      setDeleteColabModal(false);

      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  // Search
  const handleSearchProjects = () => {
    setSearch(!search);
  };

  // Sign out
  const closeProjects = () => {
    setProjects([]);
    setProject({});
    setAlert({});
  };

  return (
    <contextProjects.Provider
      value={{
        projects,
        showAlert,
        alert,
        submitProject,
        getProject,
        project,
        loading,
        eraseProject,
        modalFormTask,
        handleModalTask,
        submitTask,
        handleModalEditTask,
        task,
        modalEraseTask,
        handleModalEraseTask,
        eraseTask,
        submitColab,
        colab,
        addColab,
        handleModalDeleteColab,
        deleteColabModal,
        deleteColab,
        completeTask,
        search,
        handleSearchProjects,
        submitTasksSocket,
        deleteTaskSocket,
        editedTaskSocket,
        completedTaskSocket,
        closeProjects,
      }}
    >
      {children}
    </contextProjects.Provider>
  );
};

export { ProjectsProvider };

export default contextProjects;
