import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import { verifyAccessToken } from "../config/auth";
import { InvalidRequestException } from "../exceptions/validationExceptions";
import { InvalidBearerTokenException } from "../exceptions/authExceptions";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new InvalidRequestException());
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded: string | JwtPayload = verifyAccessToken(token);

  if (!decoded || typeof decoded === "string" || !decoded.sub) {
    next(new InvalidBearerTokenException());
  }

  res.locals.userId = decoded.sub;

  // TODO: edit user info

  next();
};

export default verifyJWT;
