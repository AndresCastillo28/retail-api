import { Request, Response, NextFunction } from "express";
export const wrap =
  <T extends (req: Request, res: Response) => Promise<any>>(fn: T) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);
