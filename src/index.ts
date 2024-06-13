import express from "express";
import vhost from "vhost";
import cors from "cors";

import webApp from "./web/webApp";
import repoApp from "./repo/repoApp";

require("dotenv").config();

const requiredEnvVars = ["ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

const mainApp = express();
mainApp.use(cors(require("./config/corsOptions")));
mainApp.use(vhost("kloudcommit.com", webApp));
mainApp.use(vhost("repo.kloudcommit.com", repoApp));

const mainPort = process.env.MAIN_APP_PORT || 8080;
mainApp.listen(mainPort, () => console.log(`Server main running on http://localhost:${mainPort}/`));

const webPort = process.env.WEB_APP_PORT || 8081;
webApp.listen(webPort, () => console.log(`Server webApp running on http://localhost:${webPort}/`));

const repoPort = process.env.REPO_APP_PORT || 8082;
repoApp.listen(repoPort, () => console.log(`Server repoApp running on http://localhost:${repoPort}/`));
