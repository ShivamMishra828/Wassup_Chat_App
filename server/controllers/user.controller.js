import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";

export const updateMe = async (req, res) => {
  try {
    const { user } = req;
    const { firstName, lastName, about, avatar } = req.body;

    if (!firstName || !lastName || !about || !avatar) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide all the required fields",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        firstName,
        lastName,
        about,
        avatar,
      },
      { new: true, validateModifiedOnly: true }
    );

    return res.status(200).json({
      status: "success",
      data: updatedUser,
      message: "User updated Successfully",
    });
  } catch (error) {
    console.log(`Error Occured while updating user: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find({
      verified: true,
    }).select("firstName lastName _id");

    const thisUser = req.user;
    const remainingUsers = allUsers.filter(
      (user) =>
        !thisUser.friends.includes(user._id) &&
        user._id.toString() !== thisUser._id.toString()
    );

    return res.status(200).json({
      status: "success",
      data: remainingUsers,
      message: "Users fetched Successfully",
    });
  } catch (error) {
    console.log(`Error Occured while getting users: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      recipient: req.user._id,
    }).populate("sender", "firstName lastName _id");

    return res.status(200).json({
      status: "success",
      data: requests,
      message: "Friends Requests fetched Successfully",
    });
  } catch (error) {
    console.log(`Error Occured while getting requests: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getFriends = async (req, res) => {
  try {
    const friends = await User.findById(req.user._id).populate(
      "friends",
      "firstName lastName _id"
    );

    return res.status(200).json({
      status: "success",
      data: friends,
      message: "Friends fetched Successfully",
    });
  } catch (error) {
    console.log(`Error Occured while getting friends: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
