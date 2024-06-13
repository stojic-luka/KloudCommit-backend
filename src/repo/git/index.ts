import simpleGit from "simple-git";
import path from "path";
import fs from "fs";

export const git = (username: string, repoName: string) => {
  const repoDir = path.join(__dirname, `../../../repositories/${username}/${repoName}`);
  if (!fs.existsSync(repoDir)) return undefined;

  return simpleGit({
    baseDir: repoDir,
    binary: "git",
  });
};
