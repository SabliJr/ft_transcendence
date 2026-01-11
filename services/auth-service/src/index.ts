import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { PORT } from "./constants";
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
    "chrome-extension://dfkaofkdjfapeadlpjhmmbbdokbaebnl", // The local extension for dev to make requests
    "", // The production extension for dev to make requests
    "localhost:3000", // for local development
    "http://localhost:3000", // for local development
    "https://www.api.humanizewriter.com", // for local development
    "www.api.humanizewriter.com", // for local development
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
app.use(express.urlencoded({ extended: true }));

// Apply bodyParser.json() globally, but exclude /stripe/webhook
// app.use((req, res, next) => {
//   if (req.path === "/stripe/webhook") {
//     next(); // Skip bodyParser.json() for this route
//   } else {
//     bodyParser.json()(req, res, next);
//   }
// });

app.use(cors(corsOptions));

// Routes
app.use(appRoutes);

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});
