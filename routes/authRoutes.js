import express from "express";
import { login, refresh, signup } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
router.get("/refresh", refresh);

export default router;
