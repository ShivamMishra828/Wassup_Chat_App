import express from "express";
import {
  updateMe,
  getUsers,
  getFriends,
  getRequests,
} from "../controllers/user.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();

router.patch("/update-me", protect, updateMe);
router.get("/get-users", protect, getUsers);
router.get("/get-friends", protect, getFriends);
router.get("/get-friend-requests", protect, getRequests);

export default router;
