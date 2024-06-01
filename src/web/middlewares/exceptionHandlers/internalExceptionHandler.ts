import { Request, Response, NextFunction } from "express";

export default function internalExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  return res.status(500).json({
    status: "error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    },
  });
}
