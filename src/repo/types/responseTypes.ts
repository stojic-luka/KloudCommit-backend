interface BaseResponse {
  status: string;
  meta?: {
    timestamp?: string;
    apiVersion: string;
  };
}

export interface DataResponse<T> extends BaseResponse {
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  error: {
    code: string;
    message: string;
  };
}
