import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

try {
  mongoose.connect(`${process.env.dbUrl}/${process.env.dbName}`);
  console.log("Database Connected Successfully");
} catch (error) {
  res
    .status(500)
    .send({ message: "Internal Server Error", error: error.message });
  // console.log(error)
}

export default mongoose;
