import { useEffect } from "react";
import { useParams } from "react-router-dom";
import FormColab from "../components/formColab";
import useProjects from "../hooks/useProjects";
import Alert from "../components/Alert";

const NewColab = () => {
  const params = useParams();
  const { getProject, project, loading, colab, addColab, alert } =
    useProjects();
  useEffect(() => {
    getProject(params.id);
  }, []);
  if (!project?._id) {
    return <Alert alert={alert} />;
  }
  return (
    <>
      <h1 className="text-4xl font-black">Add Colab to: {project.name}</h1>

      <div className="mt-10 flex justify-center">
        <FormColab />
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        colab?._id && (
          <div className="flex justify-center mt-10">
            <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
              <h2 className="text-center mb-10 text-2xl font-bold">Result:</h2>

              <div className="flex justify-between items-center">
                <p className="">{colab.name}</p>
                <button
                  type="button"
                  className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
                  onClick={() =>
                    addColab({
                      email: colab.email,
                    })
                  }
                >
                  Add colab
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default NewColab;
