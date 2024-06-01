import { Request, Response, NextFunction } from "express";

export default function invalidRouteHandler(req: Request, res: Response, next: NextFunction) {
  return res.status(404).json({
    status: "error",
    error: {
      code: "INVALID_ROUTE",
      message: "Invalid route",
    },
  });
}
