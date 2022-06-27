// Esto es simplemente para accerder a la informacion del context AuthProvider

import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
