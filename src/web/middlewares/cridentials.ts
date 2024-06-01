import { Request, Response, NextFunction } from "express";
import allowedCorsOrigins from "../config/allowedOrigins";

export default function credentials(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;

  if (!origin) return res.status(403);

  if (allowedCorsOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }

  next();
}
