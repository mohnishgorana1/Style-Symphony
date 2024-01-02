import { Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import HomePage from './Pages/HomePage'
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;
