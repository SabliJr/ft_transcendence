import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { PORT } from "./Constants/index";
import { IncomingMessage, ServerResponse } from "http";
import appRoutes from "./appRoutes";

// For env File
dotenv.config();

const app: Application = express();

declare module "http" {
  interface IncomingMessage {
    rawBody?: Buffer;
  }
}

const corsOptions = {
  credentials: true,
  origin: [
    "localhost:3000", // for local development
    "http://localhost:3000", // for local development
  ],
  optionsSuccessStatus: 204,
  exposedHeaders: ["Set-Cookie", "ajax_redirect"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
    "XMLHttpRequest",
  ],
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

// Routes
app.use(appRoutes);

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});
