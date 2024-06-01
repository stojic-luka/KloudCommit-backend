import BaseException from "./baseException";

export class InvalidRequestException extends BaseException {
  constructor() {
    super(403, "INVALID_REQUEST", "Invalid request");
  }
}

export class IncorrectCredentialsException extends BaseException {
  constructor() {
    super(400, "INCORRECT_CREDENTIALS", "Incorrect username or password");
  }
}
