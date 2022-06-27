import { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import axios from "axios";
import axiosClient from "../config/axiosClient";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [alert, setAlert] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([name, email, password, password2].includes("")) {
      setAlert({
        msg: "All fields are required",
        error: true,
      });
      return;
    }

    if (password !== password2) {
      setAlert({
        msg: "Password does not match",
        error: true,
      });
      return;
    }

    if (password.length < 6) {
      setAlert({
        msg: "The password must have more than 6 characters",
        error: true,
      });
      return;
    }

    setAlert({});

    // Create user
    try {
      const { data } = await axiosClient.post(`/users`, {
        name,
        email,
        password,
      });
      setAlert({
        msg: data.msg,
        error: false,
      });

      setName("");
      setPassword("");
      setEmail("");
      setPassword2("");
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alert;

  return (
    <>
      <h1>hosge</h1>

      {msg && <Alert alert={alert} />}

      <form
        action=""
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <div className="my-5">
          <label
            htmlFor="name"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            type="text"
            placeholder="Name"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        {/* Email */}
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Email
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        {/* Password */}
        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            placeholder="Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        {/* Password 2 */}
        <div className="my-5">
          <label
            htmlFor="password2"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Repeat your password
          </label>
          <input
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            id="password2"
            type="password"
            placeholder="Repeat your password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <input
          type="submit"
          value="Register"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Log In
        </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/forgot-password"
        >
          I forgot my password
        </Link>
      </nav>
    </>
  );
};

export default Register;
