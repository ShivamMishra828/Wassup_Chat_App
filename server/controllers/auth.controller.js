import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import otpGenerator from "otp-generator";
import sendMail from "../services/mailer.js";
import { otpVerification } from "../templates/mail/otpVerificationTemplate.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
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
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.password = password;
      existingUser.verified = false;
      await existingUser.save({ validateBeforeSave: true });

      req.userId = existingUser._id;
      next();
    } else {
      // 3) Create a new user
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
    const user = await User.findById(userId);

    user.otp = generatedOTP;
    user.otpExpires = otpExpires;
    await user.save({ validateBeforeSave: true });

    // 3) Send OTP to the user
    await sendMail({
      to: user.email,
      from: process.env.MAIL_USERNAME,
      subject: "OTP for Verification",
      html: otpVerification(user.firstName, generatedOTP),
    });

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

    if (user.verified) {
      return res.status(400).json({
        status: "error",
        message: "User already verified",
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

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Getting token and check if it's there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in! Please log in to get access",
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token does no longer exist",
      });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "error",
        message: "User recently changed password! Please log in again",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.log(`Error Occured while protecting the Route: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1) Check if email exists
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    // 2) Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User does not exist",
      });
    }

    // 3) Generate Random Reset Token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateModifiedOnly: true });

    try {
      const resetUrl = `http://localhost:3000/auth/reset-password/?code=${resetToken}`;
      console.log(resetToken);
      return res.status(200).json({
        status: "success",
        message: "Reset Password link sent to your email successfully",
        resetUrl,
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateModifiedOnly: true });
      console.log(`Error Occured while sending Email: ${error}`);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  } catch (error) {
    console.log(`Error Occured while Forgeting your Password: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.body.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Token is invalid or has expired",
      });
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save({ new: true, validateBeforeSave: true });

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
      token,
    });
  } catch (error) {
    console.log(`Error Occured while Resetting your Password: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
