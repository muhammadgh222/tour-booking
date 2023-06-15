import passportJwt from "passport-jwt";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  console.log(token);
  return token;
};
const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_REFRESH_SECRET,
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

export const googleAuth = () => {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/v1/auth/google/redirect",
        },
        (accessToken, refreshToken, params, profile, done) => {
          User.findOne({ email: profile._json.email })
            .then((user) => {
              if (user) {
                return done(null, user);
              }

              const newUser = new User({
                googleID: profile.id,
                email: profile._json.email,
                username: profile.displayName,
                password: null,
              });

              newUser.save().then((err, user) => {
                if (err) {
                  return done(err, false);
                }

                return done(null, user);
              });
            })
            .catch((err) => {
              console.log(err);
              return done(err, false);
            });
        }
      )
    );
  } catch (error) {
    console.log(error);
  }
};
