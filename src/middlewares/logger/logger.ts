import { Request, Response, NextFunction } from "express";

export const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};
const logColors = {
  fatal: "\u001b[1;97;41m",
  error: "\u001b[31m",
  warn: "\u001b[33m",
  info: "\u001b[32m",
  debug: "\u001b[34m",
  trace: "\u001b[37m",
  reset: "\u001b[0m",
};

// const { format } = require("date-fns");

// const fs = require("fs");
// const fsPromises = require("fs").promises;
// const path = require("path");

// const logEvents = async (message: string, logName: string) => {
//   const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;

//   try {
//     if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
//       await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
//     }

//     await fsPromises.appendFile(path.join(__dirname, "..", "logs", logName));
//   } catch (err) {
//     console.log(err);
//   }
// };

// const LOGGER = (req: Request, res: Response, next: NextFunction) => {
//   logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
//   console.log(`${req.method} ${req.path}`);
//   next();
// };

// export default LOGGER;
