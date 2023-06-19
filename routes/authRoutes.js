import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

import {
  changePassword,
  forgotPassword,
  login,
  refresh,
  resetPassword,
  signup,
  verifyAccount,
} from "../controller/authController.js";
import { createAccessToken, createRefreshToken } from "../utils/issueJwt.js";

const router = express.Router();

// BASIC AUTHENTICATION
router.post("/signup", signup);
router.post("/login", login);

// GENERATES ACCESS TOKEN
router.get("/refresh", refresh);

// GOOGLE AUTHNETICATION
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    accessType: "offline",
    prompt: "consent",
  }),
  (req, res) => {
    const accessTokenObj = createAccessToken(req.user);

    const refreshTokenObj = createRefreshToken(req.user);
    res.cookie("jwt", refreshTokenObj, {
      expiresIn: new Date(
        Date.now() + process.env.JWT_REFRESH_EXPIRY * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    });

    res.status(200).json({
      accessTokenObj,
    });
  }
);

// PASSWORD AND VERIFICATION

router.get(
  "/verifyAccount/:token",

  verifyAccount
);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch(
  "/changePassword",
  passport.authenticate("jwt", { session: false }),
  changePassword
);

export default router;
