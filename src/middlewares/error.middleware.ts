import { Request, Response, NextFunction } from "express";
import { ZodError, type ZodIssue } from "zod";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const map: Record<string, number> = {
    ACCOUNT_NOT_FOUND: 404,
    INSUFFICIENT_FUNDS: 409,
    ACCOUNT_BLOCKED: 423,
    CURRENCY_MISMATCH: 409,
    SAME_ACCOUNT: 400,
  };

  if (err instanceof ZodError) {
    const details = (err.issues as ZodIssue[]).map((i) => ({
      path: i.path.join(".") || "root",
      message: i.message,
    }));
    console.error(
      "Validation failed:",
      details.map((d) => d.message)
    );
    return res.status(400).json({ error: "Validation failed", details });
  }

  const code = map[err?.message] ?? 400;
  res
    .status(code)
    .json({ error: err?.message ?? "BAD_REQUEST", message: err?.message });
}
