import { Request, Response } from "express";
import { git } from "../git";
// import { CheckRepoActions } from "simple-git";

import { spawn } from "child_process";
import { join } from "path";
// import { writeFile, chmod } from "fs/promises";

// const GIT_REPOS_PATH = "../../../repo/repositories";

// async function createRepo(repoOwner: string, repoName: string) {
//   const projectPath = join("../../../repositories", repoName);
//   const gitRepoPath = join(GIT_REPOS_PATH, repoName + ".git");

//   try {
//     console.log(123);

//     const globalGit = git(repoOwner, "");
//     if (!globalGit) return "error!";

//     console.log(123);

//     await globalGit.init(true);

//     console.log(123);

//     const repoGit = git(repoOwner, repoName);
//     if (!repoGit) return "error!";

//     console.log(123);

//     await repoGit.addConfig("core.autocrlf", "true");
//     await repoGit.addConfig("core.safecrlf", "false");
//     await repoGit.addConfig("receive.denyCurrentBranch", "ignore");
//     await repoGit.add(".");

//     const postReceiveScript = `git --work-tree="${projectPath}" checkout --force`;
//     await writeFile(join(gitRepoPath, "hooks", "post-receive"), postReceiveScript);

//     await chmod(join(gitRepoPath, "hooks", "post-receive"), "755");

//     return "ok!";
//   } catch (error) {
//     console.error(error);
//     return "error!";
//   }
// }

export const handleUploadReceivePack = async (req: Request, res: Response) => {
  const { username } = req.params;

  // const gitInstance = git(username, res.locals.repoName);
  // if ((!gitInstance && res.locals.service === "upload-pack") || (gitInstance && !(await gitInstance.checkIsRepo(CheckRepoActions.BARE)))) {
  //   await createRepo(username, res.locals.repoName);
  // }

  const gitUploadPack = spawn("git", [res.locals.service, "--stateless-rpc", "."], {
    cwd: join(__dirname, `../../../repositories/${username}/${res.locals.repoName}`),
    stdio: ["pipe", "pipe", "pipe"],
  });

  gitUploadPack.on("error", (err: Error) => {
    console.error("Failed to start gitUploadPack:", err);
    res.status(500).send("Internal server error");
  });

  gitUploadPack.on("close", (code: number) => {
    if (code !== 0) {
      console.error(`gitUploadPack process exited with code ${code}`);
      // console.error("Stderr output:", stderr);
      res.status(500).send(`gitUploadPack process failed with code ${code}`);
    }
  });

  res.type(`application/x-git-${res.locals.service}-result`);
  gitUploadPack.stdin.write(req.body);
  gitUploadPack.stdout.pipe(res);
};

export const handleInfoRefs = async (req: Request, res: Response) => {
  const { username } = req.params;

  const service = (req.query.service as string) || "upload-pack";

  const service_name = service && service.startsWith("git-") ? service.replace("git-", "") : "upload-pack";

  const gitInstance = git(username, res.locals.repoName);
  if (!gitInstance) return res.status(503);

  const result = await gitInstance.raw([service_name, "--stateless-rpc", "--advertise-refs", "."]);

  const first_line = `# service=git-${service_name}\n0000`;
  const formatted_first_line = `${first_line.length.toString(16).padStart(4, "0")}${first_line}`;

  res.type(`application/x-git-${service_name}-advertisement`);
  res.send(`${formatted_first_line}${result}`);
};
