import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'

const app = express();


// middlewares:  express.json | cors | cookieParser | morgan | 
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser());
app.use(morgan("dev"));


// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     credentials: true,
//   })
// );
// ROUTES

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/products', productRoutes)




// default route
app.use("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PONG",
  });
});


export default app;
