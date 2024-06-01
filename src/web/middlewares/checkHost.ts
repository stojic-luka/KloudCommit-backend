import { Request, Response, NextFunction } from "express";

const checkHost = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.hostname);

  next();
};

export default checkHost;
