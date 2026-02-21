export interface IErrorSource {
  path: string;
  message: string;
}
export interface TErrorResponse {
  success: boolean;
  message: string;
  error?: unknown;
  stack?: string;
  errorSource?: IErrorSource[];
}
