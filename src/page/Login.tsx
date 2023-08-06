import tofu from "../assets/tofu.jpg";
import Logo from "../assets/Logo.svg";
import { useEffect, useState } from "react";
import inputHelper from "../helper/inputHelper";
import { useLoginUserMutation } from "../Apis/authApi";
import { userModel } from "../interfaces";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../Storage/redux/userAuthSlice";
import apiResponse from "../interfaces/apiResponse";
import MainSpinner from "../common/MainSpinner";
import { json } from "stream/consumers";
import MiniSpinner from "../common/MiniSpinner";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [loginUser] = useLoginUserMutation();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
  });
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  //   useEffect(() => {
  //     const requestOptions = {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ username: "admin", password: "123456" }),
  //     };
  //     //   "http://localhost/api/employee/login";
  //     fetch("/api/admin/employee/login", requestOptions)
  //       .then((response) => response.json())
  //       .then((data) => console.log(data));
  //   }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!userInput.userName) {
      setError("user name is empty");
      return;
    }
    if (!userInput.password) {
      setError("password is empty");
      return;
    }

    setLoading(true);

    const response: apiResponse = await loginUser({
      username: userInput.userName,
      password: userInput.password,
    });

    // console.log(userInput.userName);
    // console.log(userInput.password);

    if (response.data!.data) {
      //   const { token } = response.data;
      const { id, name, username, token } = response.data!.data;
      //   const { fullName, id, email, role }: userModel = jwt_decode(token);
      //   localStorage.setItem("token", token);
      //   console.log(response.data.result);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ id, name, username, token })
      );
      dispatch(setLoggedInUser({ id, name, username, token }));
      navigate("/dashboard");
    } else {
      setError(response.data?.msg);
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 bg-slate-600 w-full fixed top-0 left-0 bottom-0 right-0 z-50 flex items-center justify-center ">
      <div className="flex bg-white rounded-lg h-[400px] w-[700px]  overflow-x-scroll m-2">
        <div className="h-full overflow-hidden w-[300px] ">
          <img src={tofu} alt="tofo" className="h-full w-full object-cover" />
        </div>

        <form
          className="space-y-4 p-12 flex flex-col  items-center w-[400px] "
          method="post"
          onSubmit={handleSubmit}
        >
          {/* <div className="flex justify-center "> */}
          <img src={Logo} alt="Logo" className="w-28" />
          {/* </div> */}

          {/* {isLoading ? (
            <div className="w-full flex-1 flex items-center justify-center">
              <MainSpinner />
            </div>
          ) : ( */}
          <div className="flex flex-col  items-center space-y-4">
            <div>
              <label
                htmlFor="userName"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Username:
              </label>
              <input
                type="text"
                name="userName"
                value={userInput.userName}
                onChange={handleUserInput}
                id="userName"
                className="w-[180px] bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block  p-2.5 dark:bg-gray-700 dark:border-gray-600"
                placeholder="input your username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={userInput.password}
                onChange={handleUserInput}
                placeholder="••••••••"
                className="w-[180px] bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block   p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div>{error && <p className=" text-red-400 ">{error}</p>}</div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white rounded-full py-2 justify-center flex "
            >
              {isLoading ? <MiniSpinner /> : <span>Sign in</span>}
            </button>
          </div>
          {/* )} */}
        </form>
      </div>
    </div>
  );
};

export default Login;
