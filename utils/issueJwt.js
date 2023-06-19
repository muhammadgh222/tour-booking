import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
  const payload = {
    sub: user._id,
  };
  const signedToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY,
  });

  return {
    token: "Bearer " + signedToken,
  };
};

export const createRefreshToken = (user) => {
  const payload = {
    sub: user._id,
  };
  const signedToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });

  return {
    signedToken,
  };
};
