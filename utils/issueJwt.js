import jwt from "jsonwebtoken";

export default (user) => {
  const payload = {
    sub: user._id,
    iat: Date.now(),
  };
  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 60,
  });

  return {
    token: "Bearer " + signedToken,
    expires: 60,
  };
};
