import { Request, Response, NextFunction } from "express";
import BaseException from "../../src/web/exceptions/baseException";

declare global {
  namespace Express {
    interface Response {
      sendWrappedResponse(data: object, statusCode?: number): void;
      sendWrappedError(err: BaseException): void;
    }
  }
}
