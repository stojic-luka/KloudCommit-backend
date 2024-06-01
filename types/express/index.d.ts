declare namespace Express {
  export interface Response {
    sendWrappedResponse(data: object, statusCode?: number): void;
    sendWrappedError(err: BaseException): void;
  }
}
