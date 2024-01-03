import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { createProduct } from "../../Redux/Slices/productsSlice";

function CreateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: null,
    previewImage: "",
  });

  const handleImageUpload = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    const uploadedImage = e.target.files[0];

    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setUserInput({
          ...userInput,
          previewImage: this.result,
          image: uploadedImage,
        });
        console.log("file uploaded");
      });
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    console.log("USER INPUT BEFORE DISPATCH>>>:  ", userInput);

    if ( !userInput.name || !userInput.description || !userInput.category || !userInput.price || !userInput.image) {
      toast.error("All Fields are Mandatory");
      console.log("All Fields are Mandatory");
      return;
    }
    const response = await dispatch(createProduct(userInput));
    if (response?.payload?.success) {
      setUserInput({
        name: "",
        description: "",
        category: "",
        price: "",
        image: null,
      });
    }
    navigate("/products");
  };
  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"
        >
          <Link className="absolute top-8 text-2xl link text-accent cursor-pointer">
            <AiOutlineArrowLeft onClick={navigate(-1)} />
          </Link>

          <h1 className="text-center text-2xl font-bold">Create New Product</h1>

          <main className="grid grid-cols-2 gap-x-10">
            <div className="gap-y-8">
              <div>
                <label htmlFor="image_uploads" className="cursor-pointer ">
                  {userInput.image ? (
                    <img
                      className="w-full h-44 m-auto border"
                      src={userInput.image}
                    />
                  ) : (
                    <div className="w-full h-44 m-auto flex items-center justify-center border">
                      <h1 className="font-bold text-lg">
                        Upload your product Image
                      </h1>
                    </div>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="image_uploads"
                  accept=".jpg, .jpeg, .png"
                  name="image_uploads"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="flex flex-col mt-2 gap-1">
                <label className="text-lg font-semibold" htmlFor="name">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter Product Name"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.name}
                  onChange={handleUserInput}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="category">
                  Product category (Male or Female)
                </label>
                <input
                  required
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter product category"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.category}
                  onChange={handleUserInput}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="price">
                  Product Price
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Enter product price"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.price}
                  onChange={handleUserInput}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="description">
                  Product description
                </label>
                <textarea
                  required
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Enter Product description"
                  className="bg-transparent px-2 py-1 h-24 overflow-y-scroll resize-none border"
                  value={userInput.description}
                  onChange={handleUserInput}
                />
              </div>
            </div>
          </main>

          <button
            type="submit"
            className="w-full py-2 rounded-sm font-semibold text-lg cursor-pointer bg-red-600 hover:bg-red-800 transition-all ease-in-out duration-300"
          >
            Create New Product
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default CreateProduct;
