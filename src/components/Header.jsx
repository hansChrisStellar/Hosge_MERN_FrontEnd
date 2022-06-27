import { Link } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import Search from "./Search";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { handleSearchProjects, closeProjects } = useProjects();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    closeProjects();
    localStorage.removeItem("token");
  };

  return (
    <header className="px-4 py-5 bg-white border-b">
      <div className="md:flex md:justify-between">
        <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">
          Hosge
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            type="button"
            className="font-bold uppercase"
            onClick={handleSearchProjects}
          >
            Search project
          </button>
          <Link to="/projects" className="font-bold uppercase">
            Projects
          </Link>

          <button
            onClick={handleSignOut}
            type="button"
            className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold"
          >
            Sign Out
          </button>
          <Search />
        </div>
      </div>
    </header>
  );
};

export default Header;
