import app from "./app.js";
import dbConnect from "./config/dbConnect.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;
dbConnect();

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
