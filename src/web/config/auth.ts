import jwt, { JwtPayload } from "jsonwebtoken";

import { AccessTokenSecretUndefined, RefreshTokenSecretUndefined } from "../exceptions/authExceptions";

const tokenAlgorithm = "HS512";
export const accessTokenExpiration = 1;
export const refreshTokenExpiration = 3;

/**
 * @throws {AccessTokenSecretUndefined}
 */
export const generateAccessToken = (userId: string): string => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new AccessTokenSecretUndefined();
  }

  return jwt.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
    },
    Buffer.from(process.env.ACCESS_TOKEN_SECRET, "base64"),
    { algorithm: tokenAlgorithm, expiresIn: accessTokenExpiration + "d" }
  );
};
/**
 * @throws {RefreshTokenSecretUndefined}
 */
export const generateRefreshToken = (userId: string): string => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new RefreshTokenSecretUndefined();
  }

  return jwt.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
    },
    Buffer.from(process.env.REFRESH_TOKEN_SECRET, "base64"),
    { algorithm: tokenAlgorithm, expiresIn: refreshTokenExpiration + "d" }
  );
};

/**
 * @throws {TokenExpiredError | JsonWebTokenError | AccessTokenSecretUndefined}
 */
export const verifyAccessToken = (token: string): string | JwtPayload => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new AccessTokenSecretUndefined();
  }

  return jwt.verify(token, Buffer.from(process.env.ACCESS_TOKEN_SECRET, "base64"));
};
/**
 * @throws {TokenExpiredError | JsonWebTokenError | RefreshTokenSecretUndefined}
 */
export const verifyRefreshToken = (token: string): string | JwtPayload => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new RefreshTokenSecretUndefined();
  }

  return jwt.verify(token, Buffer.from(process.env.REFRESH_TOKEN_SECRET, "base64"));
};
