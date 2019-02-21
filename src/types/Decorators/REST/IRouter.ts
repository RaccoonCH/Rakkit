import { ClassType } from "class-transformer/ClassTransformer";
import * as Router from "koa-router";
import { IEndpoint, MiddlewareType } from "../..";

export interface IRouter {
  path: string;
  endpoints?: IEndpoint[];
  router?: Router;
  classInstance: ClassType<any>;
  middlewares?: MiddlewareType[];
}
