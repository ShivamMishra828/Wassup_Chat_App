import app from "./app.js";
import { createServer } from "http";
import dotenv from "dotenv";
import connectToDB from "./config/database.js";

dotenv.config();

const server = createServer(app);
const PORT = process.env.PORT || 8000;

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
