import app from "./app.js";
import { createServer } from "http";
import dotenv from "dotenv";
import connectToDB from "./config/database.js";
import { Server } from "socket.io";
import User from "./models/user.model.js";

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
  console.log("User Connected: ", user_id, socket_id);

  if (user_id) {
    await User.findByIdAndUpdate(user_id, { socket_id: socket_id });
  }

  socket.on("friend_request", async (data) => {
    const to = await User.findById(data.to);
    //  TODO: send the friend request to the user
    io.to(to.socket_id).emit("new_friend_request", {});
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
