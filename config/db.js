import mongoose from "mongoose";
import "colors";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to MongoDB: ${connect.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Error in Mongodb: ${error.message}`.bgRed.white);
  }
};

export default connectDB;
