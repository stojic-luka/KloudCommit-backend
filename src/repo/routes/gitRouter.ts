import { Router } from "express";

import parseServiceType from "../middlewares/parseServiceType";
import parseRepoName from "../middlewares/parseRepoName";
import { handleUploadReceivePack, handleInfoRefs } from "../controllers/gitController";

const gitRouter = Router();

gitRouter.post("/:username/:repoName/git-upload-pack", parseRepoName, parseServiceType, handleUploadReceivePack);
gitRouter.post("/:username/:repoName/git-receive-pack", parseRepoName, parseServiceType, handleUploadReceivePack);
gitRouter.get("/:username/:repoName/info/refs", parseRepoName, handleInfoRefs);

export default gitRouter;
