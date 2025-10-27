import express from "express";
import helmet from "helmet";
import cors from "cors";

import { router as health } from "./routes/health.routes.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use("/health", health);

  return app;
}
