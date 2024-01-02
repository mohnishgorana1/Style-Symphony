import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const connectToDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    if (connection) {
      console.log(`Connected to DB: ${connection.host}`);
    }
  } catch (error) {
    console.log(`ERROR Connecting to DB: ${connection.host}`);
    console.log(error);
    process.exit(1);
  }
};

export default connectToDB