/**
 * Health & Status Route
 * ---------------------
 * Provides runtime status and metadata about the API.
 * Useful for uptime monitoring, Kubernetes probes, and debugging.
 */

import { Router, Request, Response } from "express";
import os from "os";
import packageJson from "../../package.json" with { type: "json" };

export const router = Router();

/**
 * GET /
 * @route GET /health
 * @desc Returns the service health, uptime, version, and environment details.
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const uptimeSec = process.uptime();
    const memory = process.memoryUsage();

    res.status(200).json({
      status: "ok",
      service: packageJson.name ?? "retail-api",
      version: packageJson.version,
      environment: process.env.NODE_ENV ?? "development",
      uptime: `${Math.floor(uptimeSec)}s`,
      host: os.hostname(),
      memory: {
        rss: `${Math.round(memory.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      message: "Health check failed",
    });
  }
});
