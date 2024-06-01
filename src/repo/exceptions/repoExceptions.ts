import BaseException from "./baseException";

export class InvalidRepositoryError extends BaseException {
  constructor(repoName: string) {
    super(404, "INVALID_REPOSITORY_NAME", `Repository ${repoName} does not exist`);
  }
}
