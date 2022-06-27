import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import Alert from "./Alert";

const FormProjects = () => {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [client, setClient] = useState("");

  const params = useParams();
  const { showAlert, alert, submitProject, project } = useProjects();

  useEffect(() => {
    if (params.id) {
      setId(project._id);
      setName(project.name);
      setDescription(project.description);
      setClient(project.client);
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ([name, description, deliveryDate, client].includes("")) {
      showAlert({
        msg: "All the fields are required",
        error: true,
      });

      return;
    }
    // Pass data to the provider
    await submitProject({ id, name, description, deliveryDate, client });
    setId(null);
    setName("");
    setDescription("");
    setDeliveryDate("");
    setClient("");
  };

  const { msg } = alert;

  return (
    <div>
      <form className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow">
        {msg && <Alert alert={alert} />}

        {/* Name */}
        <div className="mb-5">
          <label
            htmlFor="name"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Project name:
          </label>
          <input
            id="name"
            type="text"
            className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            placeholder="Name of the project"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label
            htmlFor="description"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Project description:
          </label>
          <textarea
            id="description"
            className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            placeholder="A brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Delivery Date */}
        <div className="mb-5">
          <label
            htmlFor="delivery-date"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Delivery date:
          </label>
          <input
            id="delivery-date"
            type="date"
            className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

        {/* Cliente */}
        <div className="mb-5">
          <label
            htmlFor="client"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Client name:
          </label>
          <input
            id="client"
            type="text"
            className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            placeholder="Client name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>

        {/* Submit */}
        <input
          type="button"
          onClick={handleSubmit}
          value={id ? "Edit Project" : "Create Project"}
          className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
        />
      </form>
    </div>
  );
};

export default FormProjects;
