import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { login, signup } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

export default router;
