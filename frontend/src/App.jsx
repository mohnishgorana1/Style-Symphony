import { Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import HomePage from "./Pages/HomePage";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import CreateProduct from "./Pages/Admin/CreateProduct";
import ProductListing from "./Pages/Products/ProductListing";
import ProductDescription from "./Pages/Products/ProductDescription";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/products/description" element={<ProductDescription />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
