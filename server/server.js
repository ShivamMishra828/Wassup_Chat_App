import app from "./app.js";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const server = createServer(app);
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
