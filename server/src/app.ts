import { Application } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "./utils/apiError.utils";

const app: Application = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const success = err.success || false;
  const message = err.message || "Internal Server Error";


  res.status(statusCode).json({
    success,
    message,
    statusCode,
  });
});

export default app;