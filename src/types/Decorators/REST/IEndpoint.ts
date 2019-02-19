import { MiddlewareType, HttpMethod } from "../..";

export interface IEndpoint {
  endpoint: string;
  method: HttpMethod;
  functions: Function[];
  middlewares?: MiddlewareType[];
}
