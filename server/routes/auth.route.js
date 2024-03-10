import express from "express";
import {
  register,
  login,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register, sendOTP);
router.post("/verify", verifyOTP);
router.post("/send-otp", sendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
