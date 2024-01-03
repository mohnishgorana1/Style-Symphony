import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  productsData: [],
};

export const createProduct = createAsyncThunk(
  "product/create",
  async (data) => {
    try {
      let formData = new FormData();
      formData.append("name", data?.name);
      formData.append("description", data?.description);
      formData.append("category", data?.category);
      formData.append("price", data?.price);
      formData.append("image", data?.image);

      const res = await axios.post("/api/v1/products/createProduct", formData);
      console.log("res >>> ", res);
      if (res.data.success) {
        toast.success("Product created Successfully");
        console.log(res?.data?.message);
        return (await res).data;
      } else {
        toast.error("Can't create Product");
      }
    } catch (error) {
      toast.error("Error Creating Product");
      console.log(error);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export default productSlice.reducer;
