import dotenv from "dotenv";
import app from "./app.js";
import connectToDB from './config/dbConnection.js'
import { v2 } from "cloudinary";

dotenv.config({
  path: "./env",
});

const PORT = process.env.PORT || 5000;

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(PORT, async() => {
    await connectToDB();
  console.log(`SERVER UP At http://localhost:${PORT}`);
});
