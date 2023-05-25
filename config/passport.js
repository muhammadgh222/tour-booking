import passportJwt from "passport-jwt";
import dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const options = {
  jwtFromRequest: (req) =>
    req.cookies.jwt
      ? req.cookies.jwt
      : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export default (passport) => {
  passport.use(
    new JwtStrategy(options, function (jwt_payload, done) {
      User.findById(jwt_payload.sub)
        .then((user) => {
          if (user) {
            return done(null, user);
          }

          return done(null, false);
        })
        .catch((err) => {
          return done(err, false);
        });
    })
  );
};
