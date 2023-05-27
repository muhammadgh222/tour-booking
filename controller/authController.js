import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import issueJwt from "../utils/issueJwt.js";

// @route POST /api/v1/auth/signup
// @desc Signup user
// @access Public

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    res.status(201).json({
      status: "success",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

// @route POST /api/v1/auth/login
// @desc Login user
// @access Public

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ status: "fail", msg: "Please provide email and password!" });
      next();
      //   return next(new AppError("Please provide email and password!", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      res
        .status(401)
        .json({ status: "fail", msg: "Incorrect email or password!" });
      return next();

      //   return next(new AppError("Incorrect email or password", 401));
    }
    const accessTokenObj = issueJwt(user);

    const payload = {
      sub: user._id,
      iat: Date.now(),
    };
    const refreshTokenObj = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.cookie("jwt", refreshTokenObj, {
      expiresIn: new Date(
        Date.now() + process.env.JWT_EXPIRY * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      token: accessTokenObj.token,
      expiresIn: accessTokenObj.expires,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, msg: "Error occured" });
  }
};

// @route POST /api/v1/auth/refresh
// @desc Refresh token
// @access Public

export const refresh = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        _id: decoded.sub,
      }).exec();
      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessTokenObj = issueJwt(foundUser);

      res.json({ accessTokenObj });
    }
  );
};
