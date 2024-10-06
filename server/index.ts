import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectMongoDB from "./db";
import { createServer } from "http";
import {Server} from "socket.io"

const port = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server);

connectMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.log("mongodb connection failed", error);
  });
