import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";

function ProductDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { role, data } = useSelector((state) => state.auth);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center justify-center text-white ">
        <div className="flex gap-10 py-10 relative ">
          {/* image */}
          <div className="w-[40%] ">
            <img
              src={state?.image?.secure_url}
              alt="product image"
              className="w-full h-96"
            />
          </div>

          {/* details */}
          <div className="flex flex-col justify-between ">
            {/* name, description, category, price */}
            <div className="space-y-5">
              <div>
                <h1 className="font-semibold text-lg sm:text-xl text-red-600 tracking-wide">
                  Product Name:{" "}
                  <span className="text-sm sm:text-lg text-white font-medium tracking-wider">
                    {" "}
                    {state?.name}{" "}
                  </span>
                </h1>
              </div>
              <div>
                <h1 className="font-semibold text-lg sm:text-xl text-red-600 tracking-wide">
                  Description:{" "}
                  <span className="text-sm sm:text-lg text-white font-medium tracking-wider">
                    {" "}
                    {state?.description}{" "}
                  </span>
                </h1>
              </div>
              <div>
                <h1 className="font-semibold text-lg sm:text-xl text-red-600 tracking-wide">
                  Price:{" "}
                  <span className="text-sm sm:text-lg text-white font-medium tracking-wider">
                    {"Rs "}
                    {state?.price}{" "}
                  </span>
                </h1>
              </div>
              <div>
                <h1 className="font-semibold text-lg sm:text-xl text-red-600 tracking-wide">
                  Category:{" "}
                  <span className="text-sm sm:text-lg text-white font-medium tracking-wider">
                    {" "}
                    {state?.category}{" "}
                  </span>
                </h1>
              </div>
            </div>
            <div className="flex items-center justify-center">
                <button className="btn bg-red-600 font-bold tracking-wider text-xl hover:bg-white hover:text-red-600 transition-all ease-in-out duration-200 ">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default ProductDescription;
