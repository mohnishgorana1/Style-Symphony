import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { login } from "../Redux/Slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });

    // console.log(loginData);
  }

  async function onLogin(e) {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill details");
      return;
    }

    // dispatch create account action
    const response = await dispatch(login(loginData));
    console.log("LOGIN RESPONSE", response);
    if (response?.payload?.success) {
      navigate("/");
    }
    setLoginData({
      email: "",
      password: "",
    });
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={onLogin}
          className="flex flex-col justify-center items-center gap-5 p-4 px-6 text-white w-96 shadow-sm shadow-primary"
        >
          <h1 className="text-center text-2xl sm:text-4xl font-bold">
            Login Page
          </h1>

          {/* //*  email, password */}
          <div className="mt-5 flex flex-col items-start justify-center gap-5">
            <div className="w-full flex items-center justify-between gap-8">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter your Email"
                onChange={handleUserInput}
                value={loginData.email}
                className="bg-transparent px--2 py-2 border text-center  "
              />
            </div>

            <div className="w-full flex items-center justify-between gap-8">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                name="password"
                id="password"
                placeholder="Enter your Password"
                onChange={handleUserInput}
                value={loginData.password}
                className="bg-transparent px--2 py-2 border text-center "
              />
            </div>

            <button
              type="submit"
              className="mt-8 self-center btn btn-block bg-red-600 hover:bg-red-700 text-base-200 font-bold text-md sm:text-lg tracking-wider"
            >
              Login
            </button>

            <p className="self-center">
              New User ?{" "}
              <Link to="/signup" className="font-medium text-red-500">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Login;
