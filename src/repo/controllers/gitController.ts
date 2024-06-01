import { Request, Response } from "express";
import { git } from "../git";

import { join } from "path";
import { writeFile, chmod } from "fs/promises";
import { CheckRepoActions } from "simple-git";
import { raw } from "@prisma/client/runtime/library";

const GIT_REPOS_PATH = "../../../repo/repositories";

async function createRepo(repoOwner: string, repoName: string) {
  const projectPath = join("../../../repositories", repoName);
  const gitRepoPath = join(GIT_REPOS_PATH, repoName + ".git");

  try {
    const globalGit = git(repoOwner, "");
    const repoGit = git(repoOwner, repoName);

    await globalGit.init(true);
    await repoGit.addConfig("core.autocrlf", "true");
    await repoGit.addConfig("core.safecrlf", "false");
    await repoGit.addConfig("receive.denyCurrentBranch", "ignore");
    await repoGit.add(".");

    const postReceiveScript = `git --work-tree="${projectPath}" checkout --force`;
    await writeFile(join(gitRepoPath, "hooks", "post-receive"), postReceiveScript);

    await chmod(join(gitRepoPath, "hooks", "post-receive"), "755");

    return "ok!";
  } catch (error) {
    console.error(error);
    return "error!";
  }
}

export const handleUploadPack = async (req: Request, res: Response) => {
  const { username } = req.params;

  const gitInstance = git(username, res.locals.repoName);
  if (!(await gitInstance.checkIsRepo(CheckRepoActions.BARE))) {
    await createRepo(username, res.locals.repoName);
  }

  let rawBody: string;
  req.on("data", (chunk: string) => (rawBody += chunk));
  req.on("end", async () => {
    // const result = await gitUploadPack(username, res.locals.repoName, rawData);
    // res.send(result);
  });
};

export const handleReceivePack = async (req: Request, res: Response) => {
  const { username } = req.params;

  const gitInstance = git(username, res.locals.repoName);
  if (!(await gitInstance.checkIsRepo(CheckRepoActions.BARE))) {
    await createRepo(username, res.locals.repoName);
  }

  let rawBody: string;
  req.on("data", function (chunk) {
    rawBody += chunk;
  });

  req.on("end", async () => {
    console.log(rawBody);
    // const result = await gitUploadPack(username, res.locals.repoName, rawData);
    // console.log(result);
    // res.send(result);
  });
};

export const handleInfoRefs = async (req: Request, res: Response) => {
  const { username } = req.params;
  const service = (req.query.service as string) || "upload-pack";

  const service_name = service && service.startsWith("git-") ? service.replace("git-", "") : "upload-pack";

  const gitInstance = git(username, res.locals.repoName);
  const result = await gitInstance.raw([service_name, "--stateless-rpc", "--advertise-refs", "."]);

  const first_line = `# service=git-${service_name}\n0000`;
  const formatted_first_line = `${first_line.length.toString(16).padStart(4, "0")}${first_line}`;

  res.set("Content-Type", `application/x-git-${service_name}-advertisement`);
  res.send(`${formatted_first_line}${result}`);
};
