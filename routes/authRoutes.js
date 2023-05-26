import express from "express";
import passport from "passport";
import { login, refresh, signup } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
router.get("/refresh", refresh);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/redirect",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    res.send({
      message: "google",
    });
  }
);
export default router;
