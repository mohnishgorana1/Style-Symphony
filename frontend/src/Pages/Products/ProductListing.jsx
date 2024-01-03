import React, { useEffect } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../Redux/Slices/productsSlice";
import ProductCard from "../../Components/ProductCard";
function ProductListing() {
  const dispatch = useDispatch();
  const { productsData } = useSelector((state) => state.products);
  
  async function loadProducts() {
    await dispatch(getAllProducts());
  }

  useEffect(() => {
    loadProducts();
  },[]);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-white">
        <h1 className="text-center text-3xl font-semibold mb-5">
          Explore the Fashion Products listed on{" "}
          <span className="font-bold text-red-600">View Vibes</span>
        </h1>
        <div className="mb-10 flex flex-wrap gap-14">
          {productsData?.map((element) => {
            return <ProductCard key={element._id} data={element} />;
          })}
        </div>
      </div>
    </HomeLayout>
  );
}

export default ProductListing;
