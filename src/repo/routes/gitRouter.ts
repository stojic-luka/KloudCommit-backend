import express, { Router } from "express";

import parseRepoName from "../middlewares/parseRepoName";
import { handleUploadPack, handleReceivePack, handleInfoRefs } from "../controllers/gitController";

const gitRouter = Router();

gitRouter.use("/:username/:repoName/git-upload-pack", parseRepoName, handleUploadPack);
gitRouter.use("/:username/:repoName/git-receive-pack", parseRepoName, handleReceivePack);
gitRouter.use("/:username/:repoName/info/refs", parseRepoName, handleInfoRefs);

export default gitRouter;
