import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import otpGenerator from "otp-generator";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password",
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.isPasswordCorrect(password, user.password))) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // 3) If everything is okay, send token to client
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.log(`Error Occured while logging in the User: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    // 2) Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.verified) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    } else if (existingUser && !existingUser.verified) {
      await User.findOneAndUpdate(
        { email },
        { firstName, lastName, password },
        { new: true }
      );

      req.userId = existingUser._id;
      next();
    } else {
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password,
      });

      req.userId = newUser._id;
      next();
    }
  } catch (error) {
    console.log(`Error Occured while registering the User: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const sendOTP = async (req, res, next) => {
  try {
    const { userId } = req;

    // 1) Generate OTP
    const generatedOTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpires = Date.now() + 5 * 60 * 1000;

    // 2) Save OTP and OTP Expires in the database
    await User.findByIdAndUpdate(
      userId,
      { otp: generatedOTP, otpExpires },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(`Error Occured while sending OTP: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1) Check if email and OTP exist
    if (!email || !otp) {
      return res.status(400).json({
        status: "error",
        message: "Email and OTP are required",
      });
    }

    // 2) Check if user exists
    const user = await User.findOne({ email, otpExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or OTP Expired",
      });
    }

    // 3) Check if OTP is correct
    const isOTPValid = await user.isOTPCorrect(otp, user.otp);

    if (!isOTPValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }

    // 4) Update user as verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ new: true, validateModifiedOnly: true });

    // 5) If everything is okay, send token to client
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      message: "User verified successfully",
      token,
    });
  } catch (error) {
    console.log(`Error Occured while verifying OTP: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
