import axios from "axios";
import { Request, Response, NextFunction } from "express";

import { DataResponse, ErrorResponse } from "../types/responseTypes";
import { InvalidRepositoryError } from "../exceptions/repoExceptions";
import { git } from "../git";
import { GitError } from "simple-git";

export interface RepoType {
  id: string;
  name: string;
  userId: string;
}

const getUserRepos = async (username: string): Promise<RepoType[]> => {
  const response = await axios.get<DataResponse<RepoType[]> | ErrorResponse>(`http://localhost:8081/api/v1/user/${username}/repos`);

  if (response.data.status !== "success" || response.status !== 200) {
    return [] as RepoType[];
  }

  return (response.data as DataResponse<RepoType[]>).data;
};

const userHasRepo = async (username: string, repo: string): Promise<boolean> =>
  (await getUserRepos(username)).some((item) => `${item.name}.git` === repo);

export const handleGetRepos = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;

  try {
    return res.sendWrappedResponse(await getUserRepos(username));
  } catch (err) {
    next(err);
  }
};

export const handleGetRepoInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const repo = res.locals.repoName;

  try {
    const hasRepo = await userHasRepo(username, repo);
    if (!hasRepo) return res.sendWrappedError(new InvalidRepositoryError(repo));

    return res.sendWrappedResponse({});
  } catch (err) {
    next(err);
  }
};

export const handleGetFilesFromRepo = async (req: Request, res: Response, next: NextFunction) => {
  let { username } = req.params;
  const repo = res.locals.repoName;

  try {
    const hasRepo = await userHasRepo(username, repo);
    if (!hasRepo) return res.sendWrappedError(new InvalidRepositoryError(repo));

    const gitObj = git(username, repo);
    const files = await gitObj.raw(["ls-tree", "-r", "--name-only", "HEAD"]);

    return res.sendWrappedResponse(files.split("\n").filter(Boolean));
  } catch (err) {
    if (err instanceof GitError) {
      return res.sendWrappedError(new InvalidRepositoryError(repo));
    }

    next(err);
  }
};

export const handleGetCommitsFromRepo = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const repo = res.locals.repoName;

  try {
    const hasRepo = await userHasRepo(username, repo);
    if (!hasRepo) res.sendWrappedError(new InvalidRepositoryError(repo));

    const gitObj = git(username, repo);
    const commits = await gitObj.log();

    return res.sendWrappedResponse(commits.all);
  } catch (err) {
    if (err instanceof GitError) {
      return res.sendWrappedError(new InvalidRepositoryError(repo));
    }

    next(err);
  }
};

export const handleGetCommitFromRepo = async (req: Request, res: Response, next: NextFunction) => {
  const { username, sha } = req.params;
  const repo = res.locals.repoName;

  try {
    const hasRepo = await userHasRepo(username, repo);
    if (!hasRepo) res.sendWrappedError(new InvalidRepositoryError(repo));

    const gitObj = git(username, repo);
    const commits = await gitObj.log();
    const commit = commits.all.find((commit) => commit.hash === sha);

    return res.sendWrappedResponse(commit || {});
  } catch (err) {
    if (err instanceof GitError) {
      return res.sendWrappedError(new InvalidRepositoryError(repo));
    }

    next(err);
  }
};

export const handleGetBranchesFromRepo = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const repo = res.locals.repoName;

  try {
    const hasRepo = await userHasRepo(username, repo);
    if (!hasRepo) res.sendWrappedError(new InvalidRepositoryError(repo));

    const gitObj = git(username, repo);
    const branches = await gitObj.branch();

    return res.sendWrappedResponse(branches.all);
  } catch (err) {
    if (err instanceof GitError) {
      return res.sendWrappedError(new InvalidRepositoryError(repo));
    }

    next(err);
  }
};
