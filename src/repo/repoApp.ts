import express, { Request, Response, NextFunction, Router } from "express";

// http://localhost:8082/asd/WeatherWizard

//  ROUTES
import gitRouter from "./routes/gitRouter";

//  MIDDLEWARE
import reposRouter from "./routes/reposRoutes";
import responseWrappers from "./middlewares/responseWrappers";

// TODO: setup CORS so it allows anything

const repoApp = express();
repoApp.use(responseWrappers);
repoApp.use(express.raw({ type: "application/x-git-upload-pack-request" }));
repoApp.use(express.raw({ type: "application/x-git-receive-pack-request" }));
// repoApp.use("/ping", (req: Request, res: Response) => res.status(200).json({ message: "ping from repoApp" }));

// repoApp.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(req);
//   next();
// });

repoApp.use("/", gitRouter);

const apiV1Router = Router();
apiV1Router.use("/v1", reposRouter);
repoApp.use("/api", apiV1Router);

//
//  EXCEPTION HANDLING

import internalExceptionHandler from "./middlewares/exceptionHandlers/internalExceptionHandler";
import invalidRouteHandler from "./middlewares/exceptionHandlers/invalidRouteHandler";

repoApp.use(internalExceptionHandler);
repoApp.all("*", invalidRouteHandler);

export default repoApp;
