import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import { generateAccessToken, generateRefreshToken, refreshTokenExpiration, verifyRefreshToken } from "../config/auth";
import { ReturnStatus, createUserHandler, getUserByEmail, getUserByUsername } from "../db/users";
import { CannotCreateUserException, UserAlreadyExistsException, UserNotFoundException } from "../exceptions/userExceptions";
import { IncorrectCredentialsException, InvalidRequestException } from "../exceptions/validationExceptions";
import { InvalidBearerTokenException } from "../exceptions/authExceptions";

const usingHttps = false; // set to true only when using https

export const handleSignUp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, username, passwordHash } = req.body;
  if (!email || !username || !passwordHash) return res.sendWrappedError(new InvalidRequestException());

  const existingUser = (await getUserByEmail(email)) || (await getUserByUsername(username));
  if (existingUser.user) return res.sendWrappedError(new UserAlreadyExistsException());

  const ret = await createUserHandler(email, username, passwordHash);
  if (ret.status !== ReturnStatus.Success || !ret.user) return res.sendWrappedError(new CannotCreateUserException());

  res.cookie("refreshToken", generateRefreshToken(ret.user.username), {
    httpOnly: true,
    secure: usingHttps,
    sameSite: true,
    maxAge: refreshTokenExpiration * 24 * 60 * 60 * 1000,
  });
  return res.sendWrappedResponse({
    accessToken: generateAccessToken(ret.user.username),
    user: {
      id: ret.user.id,
      email: ret.user.email,
      username: ret.user.username,
    },
  });
};

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, passwordHash } = req.body;
  if (!email || !passwordHash) return res.sendWrappedError(new InvalidRequestException());

  const user = await getUserByEmail(email);
  if (user.status !== ReturnStatus.Success || !user.user) return res.sendWrappedError(new IncorrectCredentialsException());

  // TODO: rewrite as something more secure
  if (!user.user.passwordsMatch(passwordHash)) return res.sendWrappedError(new IncorrectCredentialsException());

  res.cookie("refreshToken", generateRefreshToken(user.user.username), {
    httpOnly: true,
    secure: usingHttps,
    sameSite: true,
    maxAge: refreshTokenExpiration * 24 * 60 * 60 * 1000,
  });
  return res.sendWrappedResponse({
    accessToken: generateAccessToken(user.user.username),
    user: {
      id: user.user.id,
      email: user.user.email,
      username: user.user.username,
    },
  });
};

export const handleRefresh = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendWrappedError(new InvalidRequestException());

  const decoded: string | JwtPayload = verifyRefreshToken(refreshToken);

  if (!decoded || typeof decoded === "string" || !decoded.sub) {
    return res.sendWrappedError(new InvalidBearerTokenException());
  }

  const { user } = await getUserByUsername(decoded.sub);

  res.cookie("refreshToken", generateRefreshToken(decoded.sub), {
    httpOnly: true,
    secure: usingHttps,
    sameSite: true,
    maxAge: refreshTokenExpiration * 24 * 60 * 60 * 1000,
  });
  return res.sendWrappedResponse({
    accessToken: generateAccessToken(decoded.sub),
    user: {
      id: user?.id,
      email: user?.email,
      username: user?.username,
    },
  });
};
