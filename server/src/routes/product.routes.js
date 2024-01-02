import express from 'express'
import { createProduct } from '../controllers/product.controller.js';
import upload from '../middlewares/multer.middleware.js';


const router = express.Router();

router.post('/createProduct',upload.single('image') ,createProduct)


export default router