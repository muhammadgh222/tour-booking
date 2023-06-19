import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "./issueJwt.js";

export default (user, res, statusCode) => {
  const accessTokenObj = createAccessToken(user);

  const refreshTokenObj = createRefreshToken(user);
  res.cookie("jwt", refreshTokenObj, {
    expiresIn: new Date(
      Date.now() + process.env.JWT_REFRESH_EXPIRY * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  res.status(statusCode).json({
    success: true,
    token: accessTokenObj.token,
  });
};
