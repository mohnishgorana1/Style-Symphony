import cloudinary, { v2 } from "cloudinary";
import fs from "fs/promises";
import crypto from "crypto";

import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendEmail.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7day,
  httpOnly: true,
  secure: true,
};

const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if ((!fullName, !email, !password)) {
    return next(new AppError("All Fields are required", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("Email already exists", 409));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: "",
    },
  });

  if (!user) {
    return next(
      new AppError(
        "User Registration failed, Please try again after some time",
        400
      )
    );
  }

  // file

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        //remove file from local system
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (e) {
      new AppError(e || "File not uploaded please try again", 500);
    }
  }

  await user.save();
  const token = await user.jwtToken();

  user.password = undefined;
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

const login = async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    return next(new AppError("All Fields are Required", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || (await !user.comparePassword(password))) {
      return next(new AppError("Invalid Credentials", 400));
    }

    const token = await user.jwtToken();

    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login Success",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const logout = (req, res, next) => {
  try {
    res.cookie("token", null, { secure: true, maxAge: 0, httpOnly: true });

    res.status(200).json({
      success: true,
      message: "User Logged Out",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const forgotPassword = async (req, res, next) => {
  /*
   * phele email to deo or me check krunga ki is email ka 'user' register h bhi ya nhi
   * acha email to register h, to chalo is 'user' ke liye generatePasswordResetToken bhi krdo
   */

  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Email not registered ", 400));
  }

  const resetToken = await user.generatePasswordResetToken();

  // 'forgetPasswordToken' and 'forgetPasswordExpiry' bhi to update kr liye the 'resetToken' se to usko bhi to save krna padega na
  await user.save();

  // reset token bhi le liya or user ke andar details bhi savve krli ab url bhejna na email se

  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password${resetToken}`;
  console.log(resetPasswordURL);

  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

  const subject = "RESET PASSWORD";

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({
      success: true,
      message: "Reset URL send to your email",
    });
  } catch (error) {
    user.forgetPasswordExpiry = undefined;
    user.forgetPasswordToken = undefined;

    await user.save();

    return next(new AppError("Please try again", 400));
  }
};

const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = user.findOne({
    forgotPasswordToken,
    forgetPasswordExpiry: { $gt: Date.now },
  });

  if (!user) {
    return next(
      new AppError("Token is Invalid or Expired Please try again", 400)
    );
  }

  user.password = password;

  user.forgetPasswordToken = undefined;
  user.forgetPasswordExpiry = undefined;
  user.save();

  res.status(200).json({
    success: true,
    message: "Password changed Successfully",
  });
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user; // jwtAuth middleware se aaya h user

  if (!oldPassword || !newPassword) {
    return next(new AppError("All fields are mandatory", 400));
  }

  const user = await User.findOne(id).select(+password);
  if (!user) {
    return next(new AppError("User doesn't exist", 400));
  }

  const isPasswordValid = await User.comparePassword(newPassword);
  if (!isPasswordValid) {
    return next(new AppError("Invalid Old Password", 400));
  }

  user.password = newPassword;
  await user.save();

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

const updateProfile = async (req, res, next) => {
  const { fullName } = req.body;
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User doesn't exist", 400));
  }

  if (fullName) {
    console.log("Initial name: ", user.fullName);
    console.log("Given name for update ", fullName);

    user.fullName = fullName;
  }

  if (req.file) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms", // Save files in a folder named lms
        width: 250,
        height: 250,
        gravity: "faces", // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        crop: "fill",
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || "File not uploaded, please try again", 400)
      );
    }
  }

  await user.save();

  // user = await User.findById(id);
  console.log("USER FETCH AFTER SAVE", user);

  res.status(200).json({
    success: true,
    message: "User details updates successfully",
    user,
  });
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
