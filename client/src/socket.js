import io from "socket.io-client";

let socket;

const url = "https://wassup-chat-app-y71b.onrender.com";

const connectSocket = (user_id) => {
  socket = io(url, {
    query: `user_id=${user_id}`,
  });
};

export { connectSocket, socket };
