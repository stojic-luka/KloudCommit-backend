import express, { Router } from "express";

//  ROUTES
import gitRouter from "./routes/gitRouter";

//  MIDDLEWARE
import reposRouter from "./routes/reposRoutes";
import responseWrappers from "./middlewares/responseWrappers";

// TODO: setup CORS so it allows anything

const repoApp = express();
repoApp.use(responseWrappers);
// repoApp.use("/ping", (req: Request, res: Response) => res.status(200).json({ message: "ping from repoApp" }));

repoApp.use("/", gitRouter);

const apiV1Router = Router();
apiV1Router.use("/repos", reposRouter);
repoApp.use("/api/v1", apiV1Router);

//
//  EXCEPTION HANDLING

import internalExceptionHandler from "./middlewares/exceptionHandlers/internalExceptionHandler";
import invalidRouteHandler from "./middlewares/exceptionHandlers/invalidRouteHandler";

repoApp.use(internalExceptionHandler);
repoApp.all("*", invalidRouteHandler);

export default repoApp;
