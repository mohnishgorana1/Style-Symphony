import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { logout } from "../Redux/Slices/authSlice";

function HomeLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  // FOR DISPLAYING THE OPTIONS
  const role = useSelector((state) => state?.auth?.role);

  function changeWidth() {
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "auto";
  }

  function hideDrawer() {
    const element = document.getElementsByClassName("drawer-toggle");
    element[0].checked = false;

    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "0";
  }

  async function handleLogout(e) {
    e.preventDefault();

    const res = await dispatch(logout());
    if (res?.payload?.success) {
      navigate("/");
    }
  }

  return (
    <div className="min-h-[90vh]">
      <div className="drawer absolute left-0 z-50 w-fit">
        <input type="checkbox" id="my-drawer" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="cursor-pointer relative">
            <FiMenu
              size={"32px"}
              className="m-4 font-bold text-white"
              onClick={changeWidth}
            />
          </label>
        </div>

        <div className="drawer-side w-0">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-48 sm:w-80 h-[100%] bg-base-100 relative text-base-content">
            {/* Sidebar content here */}
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer}>
                <AiFillCloseCircle size={24} />
              </button>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>

            {isLoggedIn && role === "ADMIN" && (
              <li>
                <Link to="/admin/dashboard"> Admin DashBoard</Link>
              </li>
            )}
            {isLoggedIn && role === "ADMIN" && (
              <li>
                <Link to="/courses/create"> Create new Product</Link>
              </li>
            )}

            <li>
              <Link to="/products">Product</Link>
            </li>  
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>

            {!isLoggedIn && (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex flex-col items-center justify-between gap-5">
                  <button className="py-3 px-4 font-semibold rounded-md w-full bg-red-600 tracking-wider">
                    <Link to="/login">Login</Link>
                  </button>
                  <button className="py-3 px-4 font-bold tracking-wider rounded-md w-full bg-white text-red-600 ">
                    <Link to="/signup">Signup</Link>
                  </button>
                </div>
              </li>
            )}
            {isLoggedIn && (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex flex-col items-center justify-between gap-5">
                  <button className="py-3 px-4 font-semibold rounded-md w-full  bg-red-600 tracking-wider ">
                    <Link to="/user/profile">Profile</Link>
                  </button>
                  <button className="py-3 px-4 font-bold tracking-wider rounded-md w-full bg-white text-red-600 ">
                    <Link onClick={handleLogout}>Logout</Link>
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
      {children}
    </div>
  );
}

export default HomeLayout;
