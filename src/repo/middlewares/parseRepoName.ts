import { Request, Response, NextFunction } from "express";

const parseRepoName = (req: Request, res: Response, next: NextFunction) => {
  const { repoName } = req.params;

  if (repoName && !repoName.endsWith(".git")) {
    res.locals.repoName = repoName + ".git";
  } else if (repoName) res.locals.repoName = repoName;

  next();
};

export default parseRepoName;
