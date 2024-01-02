import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";



const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data:
    localStorage.getItem("data") != undefined
      ? JSON.parse(localStorage.getItem("data"))
      : {},
  // data: localStorage.getItem("data") || {},
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const res = await axios.post("/api/v1/user/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("res >>> ", res);

    if (res.data.success) {
      toast.success("Account created successfully");
      console.log(res?.data?.message);
      return res?.data;
    } else {
      toast.error("Failed to create account");
    }
    return (await res).data;
  } catch (error) {
    toast.error("Error creating account", error);
  }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = await axios.post("/api/v1/user/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("res >>> ", res);

    if (res.data.success) {
      toast.success("Logged in successfully");
      console.log(res?.data?.message);
      return res?.data; // (res?.data : {success, msg, user})
    } else {
      toast.error("Failed to login");
    }
    return (await res).data;
  } catch (error) {
    toast.error("Login request failed");
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = await axios.get("/api/v1/user/logout");
    console.log("res >>> ", res);

    if (res.data.success) {
      toast.success("Logged Out Successfully");
      console.log(res?.data?.message);
      return res?.data;
    } else {
      return (await res).data;
    }
  } catch (error) {
    toast.error("Logout request failed");
  }
});

export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
  try {
    const res = await axios.put(`/api/v1/user/update/${data[0]}`, data[1]);
    console.log("update profile res >>> ", res);

    if (res.data.success) {
      toast.success("Profile Updated Successfully");
      console.log(res?.data?.message);
      return res?.data;
    } else {
      toast.error("Profile Update request failed");
      return;
    }
  } catch (error) {
    toast.error("Profile Update request failed");
  }
});

export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = await axios.get("/api/v1/user/me");
    console.log("user data res >>> ", res);

    if (res.data.success) {
      return res?.data?.user;
    } else {
      toast.error("Profile Update request failed");
      return;
    }
  } catch (error) {
    toast.error("Profile fetched failed");
  }
});
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem("data", JSON.stringify(action?.payload?.user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", action?.payload?.user?.role);
      (state.isLoggedIn = true),
        (state.data = action?.payload?.user),
        (state.role = action?.payload?.user?.role);
    });
    builder.addCase(logout.fulfilled, (state) => {
      // localStorage.setItem('data', {} )
      // localStorage.setItem('isLoggedIn', false )
      // localStorage.setItem('role', "")
      localStorage.clear();
      (state.isLoggedIn = false), (state.data = {}), (state.role = "");
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      if (!action?.payload?.user) return;
      localStorage.setItem("data", JSON.stringify(action?.payload?.user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", action?.payload?.user?.role);
      state.isLoggedIn = true;
      state.data = action?.payload?.user;
      state.role = action?.payload?.user?.role;
    });
  },
});

// export const {} =authSlice.actions;
export default authSlice.reducer;
