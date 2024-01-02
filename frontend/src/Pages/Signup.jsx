import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { createAccount } from "../Redux/Slices/authSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });

    // console.log(signupData);
  }

  function getImage(e) {
    e.preventDefault();

    // getting image
    const uploadedImage = e.target.files[0];

    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  async function createNewAccount(e) {
    e.preventDefault();

    if ( !signupData.email || !signupData.password || !signupData.fullName || !signupData.avatar ) {
      toast.error("Please fill details");
      return;
    }

    //checking name field length
    if (signupData.fullName.length < 5) {
      toast.error("Name should be at least of 5 characters");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);

    console.log(formData);

    // dispatch create account action
    const response = await dispatch(createAccount(formData));
    console.log("SIGNUP RESPONSE", response);
    if (response?.payload?.success) {
      navigate("/");
    }

    setSignupData({
      fullName: "",
      email: "",
      password: "",
      avatar: "",
    });

    setPreviewImage("");
  }
  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center items-center gap-5  p-4 px-6 text-white w-96 shadow-sm shadow-primary"
        >
          <h1 className="text-center text-2xl sm:text-4xl font-bold">
            Registration Page
          </h1>
          <label htmlFor="image_uploads" className="cursor-pointer">
            {previewImage ? (
              <img
                className="w-24 h-24 rounded-full m-auto"
                src={previewImage}
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            className="hidden"
            type="file"
            name="image_uploads"
            id="image_uploads"
            accept=".jpg, .jpeg, .png, .svg"
            onChange={getImage}
          />

          {/* //* full name, email, password */}
          <div className="mt-5 flex flex-col items-start justify-center gap-5">
            <div className="w-full flex items-center justify-between gap-8">
              <label htmlFor="fullName" className="font-semibold">
                Full Name
              </label>
              <input
                type="text"
                required
                name="fullName"
                id="fullName"
                placeholder="Enter your fullName"
                onChange={handleUserInput}
                value={signupData.fullName}
                className="bg-transparent px--2 py-2 border text-center "
              />
            </div>

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
                value={signupData.email}
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
                value={signupData.password}
                className="bg-transparent px--2 py-2 border text-center  "
              />
            </div>

            <button
              type="submit"
              className="text-white mt-8 self-center btn btn-block bg-red-600 hover:bg-red-700 font-semibold tracking-widest text-md sm:text-lg"
            >
              Create Account
            </button>

            <p className="self-center">
              Already have an account ?{" "}
              <Link to="/login" className="text-red-600 font-medium">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Signup;
