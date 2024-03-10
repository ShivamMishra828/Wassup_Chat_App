import express from "express";
import { updateMe } from "../controllers/user.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();

router.patch("/update-me", protect, updateMe);

export default router;
