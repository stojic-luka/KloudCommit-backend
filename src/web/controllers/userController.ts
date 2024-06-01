import { Request, Response, NextFunction } from "express";

import { ReturnStatus, getUserReposByUsername, getUserByUsername, deleteUserHandler } from "../db/users";
import { UserNotFoundException } from "../exceptions/userExceptions";
import { InvalidRequestException } from "../exceptions/validationExceptions";

export const handleGetUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  if (!username) return res.sendWrappedError(new InvalidRequestException());

  const { user, status } = await getUserByUsername(username);

  if (status === ReturnStatus.NotFound) {
    return res.sendWrappedError(new UserNotFoundException());
  } else if (status !== ReturnStatus.Success) {
    return res.sendWrappedError(new UserNotFoundException());
  }

  return res.sendWrappedResponse({
    id: user?.id,
    email: user?.email,
    username: user?.username,
  });
};

export const handleGetUserRepos = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  if (!username) return res.sendWrappedError(new InvalidRequestException());

  const { repos, status } = await getUserReposByUsername(username);

  if (status === ReturnStatus.NotFound) {
    return res.sendWrappedError(new UserNotFoundException());
  } else if (status !== ReturnStatus.Success || !repos) {
    return res.sendWrappedError(new UserNotFoundException());
  }

  return res.sendWrappedResponse(repos);
};

export const handleDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  if (!username) return res.sendWrappedError(new InvalidRequestException());

  const ret = await getUserByUsername(username);
  if (ret.status === ReturnStatus.NotFound || !ret.user) {
    return res.sendWrappedError(new UserNotFoundException());
  }

  const { status } = await deleteUserHandler(username);

  if (status === ReturnStatus.NotFound) {
    return res.sendWrappedError(new UserNotFoundException());
  } else if (status !== ReturnStatus.Success) {
    return res.sendWrappedError(new UserNotFoundException());
  }

  return res.sendWrappedResponse({ message: "User deleted successfully" });
};
