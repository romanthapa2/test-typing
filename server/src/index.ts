import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectMongoDB from "./db";
import { createServer } from "http";
import { startSocketOneVersusOne } from "./socket/1v1";


const port = process.env.PORT || 3000;

const server = createServer(app);

async function startServer() {
  try {
    await connectMongoDB();
    startSocketOneVersusOne(server);
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error: unknown) {
    console.log("mongodb connection failed", error);
  }
}

startServer();
