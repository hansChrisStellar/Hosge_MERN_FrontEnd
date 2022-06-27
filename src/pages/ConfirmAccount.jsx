import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Alert from "../components/Alert";

const ConfirmAccount = () => {
  const params = useParams();
  const { id } = params;
  const [alert, setAlerta] = useState({});
  const [accountConfirmed, setAccountConfirmed] = useState(false);
  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const url = `http://localhost:4000/api/users/confirm/${id}`;
        const { data } = await axios(url);
        setAlerta({
          msg: data.msg,
          error: false,
        });
        setAccountConfirmed = true;
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    confirmAccount();
  }, []);

  const { msg } = alert;

  return (
    <>
      <div>confirm</div>
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alert alert={alert} />}

        {accountConfirmed && (
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/"
          >
            Log In
          </Link>
        )}
      </div>
    </>
  );
};

export default ConfirmAccount;
