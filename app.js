import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import myPassport, { googleAuth } from "./config/passport.js";
myPassport(passport);
googleAuth();
// Development dependencies
import morgan from "morgan";

// Routes
import authRoutes from "./routes/authRoutes.js";

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
app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send({
    message: "Hello",
  });
});
export default app;
