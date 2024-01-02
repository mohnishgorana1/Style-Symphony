import express from "express";
import {
  createProduct,
  getAllProducts,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/").get(getAllProducts);
router.post("/createProduct", upload.single("image"), createProduct);

export default router;
