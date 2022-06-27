import { Outlet } from "react-router-dom";
// cuando el componente nav es la base de la ruta, el outlet participa de modo que inyecta los componentes que van debajo de la ruta padre
const AuthLayout = () => {
  return (
    <>
      <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
        <div className="md:w-2/3 lg:w-2/5">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
