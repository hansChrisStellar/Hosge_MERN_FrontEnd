import React from "react";
import useProjects from "../hooks/useProjects";

const Colab = ({ colab }) => {
  const { handleModalDeleteColab } = useProjects();
  const { name, email } = colab;
  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div>
        <p>{name}</p>
        <p className="text-sm text-gray-700">{email}</p>
      </div>

      <div>
        <button
          type="button"
          onClick={() => handleModalDeleteColab(colab)}
          className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Colab;
