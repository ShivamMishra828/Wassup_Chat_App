import app from "./app.js";
import { createServer } from "http";
import dotenv from "dotenv";
import connectToDB from "./config/database.js";
import { Server } from "socket.io";
import User from "./models/user.model.js";
import FriendRequest from "./models/friendRequest.model.js";

dotenv.config();

const server = createServer(app);
const PORT = process.env.PORT || 8000;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

connectToDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error Occured while Connecting to DB:- ${error}`);
    process.exit(1);
  });

io.on("connection", async (socket) => {
  const user_id = socket.handshake.query["user_id"];
  const socket_id = socket.id;
  console.log(`User Connected with ID: ${user_id}`);

  if (Boolean(user_id)) {
    await User.findByIdAndUpdate(user_id, { socket_id: socket_id });
  }

  socket.on("friend_request", async (data) => {
    const to_user = await User.findById(data.to).select("socket_id");
    const from_user = await User.findById(data.from).select("socket_id");

    await FriendRequest.create({
      sender: data.from,
      recipient: data.to,
    });
    //  TODO: send the friend request to the user
    io.to(to_user.socket_id).emit("new_friend_request", {
      message: "You have a new friend request",
    });

    io.to(from_user.socket_id).emit("request_sent", {
      message: "Friend request sent successfully",
    });
  });

  socket.on("accept_request", async (data) => {
    const request_doc = await FriendRequest.findById(data.request_id);

    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.sender);

    await sender.save({ new: true, validateModifiedOnly: true });
    await receiver.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);

    io.to(sender.socket_id).emit("request_accepted", {
      message: "Friend request accepted",
    });

    io.to(receiver.socket_id).emit("request_accepted", {
      message: "Friend request accepted",
    });
  });

  socket.on("end", async () => {
    console.log(`User Disconnected with ID: ${user_id}`);
    socket.disconnect(0);
  });
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection: ", error);
  server.close(() => {
    process.exit(1);
  });
});
