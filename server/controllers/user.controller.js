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
