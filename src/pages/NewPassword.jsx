import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";

const NewPassword = () => {
  const [validToken, setValidToken] = useState(false);
  const [alert, setAlert] = useState({});
  const [password, setPassword] = useState("");
  const params = useParams();
  const { token } = params;
  useEffect(() => {
    const checkToken = async () => {
      try {
        await axiosClient(`/users/forgot-password/${token}`);
        setValidToken(true);
      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    checkToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setAlert({
        msg: "The password must have more than 6 characters",
        error: true,
      });
      return;
    }

    try {
      const url = `http://localhost:4000/api/users/forgot-password/${token}`;
      const { data } = await axios.post(url, { password });
      setAlert({
        msg: data.msg,
        error: false,
      });
    } catch (error) {
      console.log(error);
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alert;

  return (
    <>
      <div>Reset your password</div>

      {msg && <Alert alert={alert} />}

      {validToken && (
        <form
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
        >
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Type your new password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <input
            type="submit"
            value="Set new password"
            className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}
    </>
  );
};

export default NewPassword;
