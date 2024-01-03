import { Product } from "../models/products.model.js";
import AppError from "../utils/error.util.js";
import cloudinary, { v2 } from "cloudinary";
import fs from "fs/promises";

export const createProduct = async (req, res, next) => {
  const { name, description, category, price } = req.body;

  //   console.log(req.body);
  //   console.log(req.file);
  if (!name || !description || !price || !category) {
    return next(new AppError("All fields are required", 400));
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    image: {
      secure_url: "",
      public_id: "",
    },
  });

  if (!product) {
    return next(new AppError("Error creating the Product", 500));
  }

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "products",
      });

      if (result) {
        product.image.secure_url = result.secure_url;
        product.image.public_id = result.public_id;

        //remove file from local system
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (e) {
      new AppError(
        e || "Product Image File not uploaded please try again",
        500
      );
    }
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product Created Successfully",
    product,
  });
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      success: true,
      message: "All Products",
      products,
    });
  } catch (error) {
    return next(
      new AppError(e.message, "Something went wrong while fetching products")
    );
  }
};

export const getSingleProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError("Invalid Product ID", 500));
    }

    res.status(200).json({
      success: true,
      message: "Product Fetched Successfully",
      product
    });
  } catch (error) {
    return next(new AppError(e.message, 500));
  }
};
