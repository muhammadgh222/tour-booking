import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = process.env.DB_URI;

const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connect;
