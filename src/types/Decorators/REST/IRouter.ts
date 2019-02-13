import * as Router from "koa-router";
import { MiddlewareType, IEndpoint } from "@types";

export interface IRouter {
  path: string;
  middlewares: MiddlewareType[];
  endpoints?: IEndpoint[];
  router?: Router;
  // extends?: Object;
}
