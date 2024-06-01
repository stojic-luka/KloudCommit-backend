import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export default function jwtExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof TokenExpiredError) {
    return res.status(403).json({
      status: "error",
      error: {
        code: "TOKEN_EXPIRED",
        message: "Token Expired",
      },
    });
  } else if (err instanceof JsonWebTokenError) {
    return res.status(403).json({
      status: "error",
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid Token",
      },
    });
  }

  next(err);
}
