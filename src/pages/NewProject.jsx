import FormProjects from "../components/formProjects";

const NewProject = () => {
  return (
    <>
      <h1 className="text-4xl font-black">New Project</h1>

      <div className="mt-10 flex justify-center">
        <FormProjects />
      </div>
    </>
  );
};

export default NewProject;
