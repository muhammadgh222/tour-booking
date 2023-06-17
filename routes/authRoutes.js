import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

import {
  login,
  refresh,
  signup,
  verifyAccount,
} from "../controller/authController.js";
import issueJwt from "../utils/issueJwt.js";

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
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    accessType: "offline",
    prompt: "consent",
  }),
  (req, res) => {
    // const accessTokenObj = issueJwt(req.user);

    // const payload = {
    //   sub: req.user._id,
    //   iat: Date.now(),
    // };
    // const refreshTokenObj = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRY,
    // });
    // console.log(refreshTokenObj);
    // res.cookie("jwt", refreshTokenObj, {
    //   expiresIn: new Date(
    //     Date.now() + process.env.JWT_EXPIRY * 24 * 60 * 60 * 1000
    //   ),
    //   httpOnly: true,
    // });

    res.redirect(`/dashboard`);
  }
);

router.get("/verifyAccount/:token", verifyAccount);

export default router;
