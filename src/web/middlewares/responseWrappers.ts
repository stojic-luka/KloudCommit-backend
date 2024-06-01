import { Request, Response, NextFunction } from "express";
import BaseException from "../exceptions/baseException";

export default function responseWrappers(req: Request, res: Response, next: NextFunction) {
  res.sendWrappedResponse = (data: object, statusCode: number = 200) => {
    return res.status(statusCode).json({
      status: "success",
      data: data,
      meta: {
        apiVersion: "v1",
      },
    });
  };

  res.sendWrappedError = (err: BaseException) => {
    const { responseCode, errorCode, message } = err;
    return res.status(responseCode).json({
      status: "error",
      error: {
        code: errorCode,
        message: message,
      },
      meta: {
        apiVersion: "v1",
      },
    });
  };

  next();
}
