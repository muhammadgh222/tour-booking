import jwt from "jsonwebtoken";
import issueJwt from "./issueJwt.js";

export default (user, res, statusCode) => {
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

  res.status(statusCode).json({
    success: true,
    token: accessTokenObj.token,
    expiresIn: accessTokenObj.expires,
  });
};
