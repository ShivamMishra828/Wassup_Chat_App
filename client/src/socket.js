import io from "socket.io-client";

let socket;

const url =
  "http://localhost:5000" || "https://wassup-chat-app-y71b.onrender.com";

const connectSocket = (user_id) => {
  socket = io(url, {
    query: `user_id=${user_id}`,
  });
};

export { connectSocket, socket };
