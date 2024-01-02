import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/").get(getAllProducts);
router.post("/createProduct", upload.single("image"), createProduct);
router.route('/:id')
    .get(getSingleProduct)

export default router;
