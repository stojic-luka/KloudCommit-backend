import simpleGit from "simple-git";
import path from "path";

export const git = (username: string, repoName: string) =>
  simpleGit({
    baseDir: path.join(__dirname, `../../../repositories/${username}/${repoName}`),
    binary: "git",
  });
