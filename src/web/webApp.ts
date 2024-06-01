import express, { Router } from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/v1/authRoutes";
import userRouter from "./routes/v1/userRoutes";
import verifyJWT from "./middlewares/auth";
import responseWrapper from "./middlewares/responseWrappers";

const webApp = express();
webApp.use(express.json());
webApp.use(cookieParser());
webApp.use(responseWrapper);
// webApp.use("/ping", (req: Request, res: Response, next: NextFunction) => res.status(200).json({ message: "ping from webApp" }));

const apiV1Router = Router();
apiV1Router.use("/auth", authRouter);
// apiV1Router.use("/user", verifyJWT, userRouter);
apiV1Router.use("/user", userRouter);
webApp.use("/api/v1", apiV1Router);

//
//  EXCEPTION HANDLING

import * as otherExceptionHandlers from "./middlewares/exceptionHandlers/thirdPartyExceptionHandlers";
import internalExceptionHandler from "./middlewares/exceptionHandlers/internalExceptionHandler";
import invalidRouteHandler from "./middlewares/exceptionHandlers/invalidRouteHandler";

Object.values(otherExceptionHandlers).forEach((value) => webApp.use(value));
webApp.use(internalExceptionHandler);
webApp.all("*", invalidRouteHandler);

export default webApp;
