import BaseException from "./baseException";

export class UserNotFoundException extends BaseException {
  constructor() {
    super(400, "USER_NOT_FOUND", "User Not Found");
  }
}

export class CannotCreateUserException extends BaseException {
  constructor() {
    super(500, "CANNOT_CREATE_USER", "User cannot create user");
  }
}

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super(403, "USER_ALREADY_EXISTS", "User already exists");
  }
}
