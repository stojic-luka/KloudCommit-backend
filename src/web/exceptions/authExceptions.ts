import BaseException from "./baseException";

export class AccessTokenSecretUndefined extends Error {
  constructor() {
    super("REFRESH_TOKEN_SECRET environment variable is undefined");
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class RefreshTokenSecretUndefined extends Error {
  constructor() {
    super("REFRESH_TOKEN_SECRET environment variable is undefined");
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidBearerTokenException extends BaseException {
  constructor() {
    super(400, "INVALID_BEARER_TOKEN", "Invalid or expired bearer token");
  }
}
