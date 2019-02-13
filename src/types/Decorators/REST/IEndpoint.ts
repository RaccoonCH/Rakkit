import { MiddlewareType, HttpMethod } from "@types";
import { Middleware } from "koa";

export interface IEndpoint {
  endpoint: string;
  method: HttpMethod;
  functions: Middleware[];
  middlewares: MiddlewareType[];
}
