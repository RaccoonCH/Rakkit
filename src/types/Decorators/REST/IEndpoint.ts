import { RequestHandlerParams } from "express-serve-static-core";
import { MiddlewareType, HttpMethod } from "@types";

export interface IEndpoint {
  endpoint: string;
  method: HttpMethod;
  functions: RequestHandlerParams[];
  middlewares: MiddlewareType[];
}
