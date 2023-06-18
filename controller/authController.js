import jwt from "jsonwebtoken";
import crypto from "crypto";
import AsyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import issueJwt from "../utils/issueJwt.js";
import sendEmail from "../utils/sendEmail.js";
import AppError from "../utils/AppError.js";
import sendToken from "../utils/sendToken.js";

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

    const verificationToken = newUser.createVerificationToken();

    await newUser.save({ validateBeforeSave: false });
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verifyAccount/${verificationToken}`;

    const message = `Click this link to verify your account : ${verificationUrl}`;

    try {
      await sendEmail({
        email,
        subject: "Verify your account",
        message,
      });

      res.status(201).json({
        status: "success",
        newUser,
        message: `Verification email was sent to:${email} . Please check your email!`,
      });
    } catch (error) {
      newUser.verificationToken = undefined;
      await newUser.save({ validateBeforeSave: false });
      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
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
    sendToken(user, res, 200);
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

// @route GET /api/v1/auth/verifyAccount
// @desc Email verification
// @access Public

export const verifyAccount = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
    });
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "You account has been verified",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
    });
  }
};

// PASSWORD RECOVERY FEATURES

// @route POST /api/v1/auth/forgotPassword
// @desc Password recovery
// @access Public

export const forgotPassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with such an email.", 401));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit click the link belowe and provide your new password : ${resetURL} \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

// @route PATCH /api/v1/auth/resetPassword/:token
// @desc Password reset
// @access Public

export const resetPassword = AsyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  if (!password || !passwordConfirm) {
    return next(new AppError("Please add and confirm your password", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendToken(user, res, 200);
});

// @route PATCH /api/v1/auth/forgotPassword
// @desc Password recovery
// @access Public

export const changePassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  sendToken(user, res, 200);
});
