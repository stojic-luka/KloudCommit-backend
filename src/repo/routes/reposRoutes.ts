import { Router } from "express";
import parseRepoName from "../middlewares/parseRepoName";

import {
  handleGetRepos,
  handleGetRepoInfo,
  handleGetFilesFromRepo,
  handleGetCommitsFromRepo,
  handleGetCommitFromRepo,
  handleGetBranchesFromRepo,
} from "../controllers/reposController";

const reposRouter = Router();

reposRouter.get("/:username/", handleGetRepos);
reposRouter.get("/:username/:repoName", parseRepoName, handleGetRepoInfo);
reposRouter.get("/:username/:repoName/files", parseRepoName, handleGetFilesFromRepo);
reposRouter.get("/:username/:repoName/commits", parseRepoName, handleGetCommitsFromRepo);
reposRouter.get("/:username/:repoName/commits/:sha", parseRepoName, handleGetCommitFromRepo);
reposRouter.get("/:username/:repoName/branches", parseRepoName, handleGetBranchesFromRepo);

export default reposRouter;
