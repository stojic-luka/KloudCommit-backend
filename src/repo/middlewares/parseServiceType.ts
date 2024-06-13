import { Request, Response, NextFunction } from "express";

const parseServiceType = (req: Request, res: Response, next: NextFunction) => {
  const requestUrl = req.url;
  const lastIndex = requestUrl.lastIndexOf("/");

  if (lastIndex === -1) return res.status(503);
  res.locals.service = requestUrl.slice(lastIndex + 1).slice(4);

  next();
};

export default parseServiceType;
