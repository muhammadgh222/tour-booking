import passport from "passport";
import localStrategy from "passport-local";
import User from "../models/userModel.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";

passport.use(
  "local",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.create({ email, password });
        console.log(user);
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// ...

passport.use(
  "local",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  console.log("hi", token);

  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_REFRESH_SECRET
  );

  const currentUser = await User.findById(decoded.sub);

  req.user = currentUser;
  next();
};
