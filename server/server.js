import app from "./app.js";
import { createServer } from "http";
import dotenv from "dotenv";
import connectToDB from "./config/database.js";
import { Server } from "socket.io";
import User from "./models/user.model.js";
import FriendRequest from "./models/friendRequest.model.js";
import path from "path";
import OneToOneMessage from "./models/oneToOneMessage.model.js";
import { on } from "events";

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
    await User.findByIdAndUpdate(user_id, {
      socket_id: socket_id,
      status: "Online",
    });
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

  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    const existing_conversations = await OneToOneMessage.find({
      participants: { $all: [user_id] },
    }).populate("participants", "firstName lastName _id email status");

    callback(existing_conversations);
  });

  socket.on("start_conversation", async (data) => {
    try {
      const { to, from } = data;
      const existing_conversation = await OneToOneMessage.find({
        participants: { $size: 2, $all: [to, from] },
      }).populate("participants", "firstName lastName _id email status");

      if (existing_conversation.length === 0) {
        let new_chat = await OneToOneMessage.create({
          participants: [to, from],
        });

        new_chat = await OneToOneMessage.findById(new_chat._id).populate(
          "participants",
          "firstName lastName _id email status"
        );

        socket.emit("start_chat", new_chat);
      } else {
        console.log(`Existing Conversation: ${existing_conversation[0]}`);
        socket.emit("start_chat", existing_conversation[0]);
      }
    } catch (error) {
      console.log(`Error Occured while starting conversation: ${error}`);
    }
  });

  socket.on("get_messages", async (data, callback) => {
    const { messages } = await OneToOneMessage.findById(
      data.conversation_id
    ).select("messages");

    callback(messages);
  });

  socket.on("text_message", async (data) => {
    const { to, from, message, conversation_id, type } = data;
    const to_user = await User.findById(to);
    const from_user = await User.findById(from);
    const new_message = {
      to,
      from,
      type,
      text: message,
      createdAt: Date.now(),
    };

    const chat = await OneToOneMessage.findById(conversation_id);
    chat.messages.push(new_message);
    await chat.save();

    io.to(to_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });

    io.to(from_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });
  });

  socket.on("file_message", async (data) => {
    const fileExtension = path.extname(data.file.name);
    const fileName = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${fileExtension}`;
  });

  socket.on("end", async (data) => {
    if (data.user_id) {
      await User.findByIdAndUpdate(data.user_id, {
        status: "Offline",
      });
    }
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
