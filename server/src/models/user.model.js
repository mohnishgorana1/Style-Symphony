import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import crypto from 'crypto'

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minLength: [5, "Name must be at least 5 char"],
      maxLength: [50, "Name must be at less than 50 char"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "already registered"],
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill in a valid email address",
      ], // Matches email against regex
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "Password must be at least 8 char"],
      select: false, // by default agar user mango ge to password nhi milega ise explicitly mangna padega
    },
    subscription: {
      id: String,
      status: String,
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgetPasswordToken: {
      type: String,
    },
    forgetPasswordExpiry: {
      type: Date,
    },
    forgetPasswordDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // stop fn
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

// userSchema me ek method banaya 'jwtToken' wo return krega Jwt.sign() // sign() payload, SECRET key, Buffer(expiry time) leta h
userSchema.methods = {
  async jwtToken() {
    return await Jwt.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  },

  async comparePassword(plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
  },

  async generatePasswordResetToken() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    // isi resetToken ke jariye me is user ke liye forgetPasswordToken bhi bna dunga
    this.forgetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
      
    this.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },
};

export const User = mongoose.model("User", userSchema);
