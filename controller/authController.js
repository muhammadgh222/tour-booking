import User from "../models/userModel.js";
import issueJwt from "../utils/issueJwt.js";

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

    res.status(201).json({
      status: "success",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

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
    const tokenObj = issueJwt(user, res);

    res.status(200).json({
      success: true,
      token: tokenObj.token,
      expiresIn: tokenObj.expires,
    });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ success: false, msg: "you entered the wrong password" });
  }
};
