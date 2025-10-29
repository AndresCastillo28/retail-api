import express from "express";
import helmet from "helmet";
import cors from "cors";

import { router as health } from "./routes/health.routes.js";
import { router as accounts } from "./routes/accounts.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { testConnection } from "./config/db.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Database
  testConnection();

  app.use("/health", health);
  app.use("/accounts", accounts);

  app.use(errorMiddleware);

  return app;
}
