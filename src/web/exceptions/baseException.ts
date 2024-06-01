export default class BaseException extends Error {
  public responseCode: number;
  public errorCode: string;

  constructor(responseCode: number, errorCode: string, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.responseCode = responseCode;
    this.errorCode = errorCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
