import jwt from "jsonwebtoken";

export default (user, res) => {
  const payload = {
    sub: user._id,
    iat: Date.now(),
  };
  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  res.cookie("jwt", signedToken, {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRY * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  return {
    token: "Bearer " + signedToken,
    expires: process.env.JWT_EXPIRY,
  };
};
