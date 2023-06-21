import jwt from "jsonwebtoken";
import crypto from "crypto";
import AsyncHandler from "express-async-handler";

import { getOne } from "./handleFactory.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";

export const getProfile = AsyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

export const updateProfile = AsyncHandler(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /changePassword.",
        400
      )
    );
  }
  const user = req.user.id;
  const email = req.body.email;
  const username = req.body.username;

  const updatedUser = await User.findByIdAndUpdate(
    user,
    { username, email },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    updatedUser,
  });
});

export const getUser = getOne(User);
