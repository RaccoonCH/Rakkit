import { MiddlewareType, IEndpoint } from "@types";
import { Router } from "express";

export interface IRouter {
  path: string;
  middlewares: MiddlewareType[];
  endpoints?: IEndpoint[];
  router?: Router;
  // extends?: Object;
}
