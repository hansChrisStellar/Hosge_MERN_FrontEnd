import { useContext } from "react";
import projectsProvider from "../context/ProjectsProvider";

const useProjects = () => {
  return useContext(projectsProvider);
};

export default useProjects;
