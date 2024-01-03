import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/authSlice";
import productsSliceReducer from "./Slices/productsSlice";

const store = configureStore({
    reducer:{
        auth: authSliceReducer,
        products: productsSliceReducer
    },
    devTools: true
})

export default store