import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import myPassport, { googleAuth } from "./config/passport.js";
import jwt from "jsonwebtoken";
myPassport(passport);
googleAuth();
// Development dependencies
import morgan from "morgan";

// Routes
import authRoutes from "./routes/authRoutes.js";
import ErrorHandler from "./utils/ErrorHandler.js";

const app = express();

app.use(morgan("tiny"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/v1/auth", authRoutes);

app.get("/hi", (req, res) => {
  res.send({
    message: "Hello",
  });
});
app.get("/dashboard", async (req, res) => {
  try {
    // Retrieve user data from database using userId
    // ...

    res.send(`Welcome !`);
  } catch (err) {
    console.log(err);
    res.status(401).send("Invalid token");
  }
});
app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send({
    message: "Hello",
  });
});

app.use(ErrorHandler);
export default app;
