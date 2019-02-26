import * as Router from "koa-router";
import {
  IEndpoint,
  MiddlewareType,
  IDecorator
} from "../..";

export interface IRouter {
  path: string;
  endpoints?: IDecorator<IEndpoint>[];
  router?: Router;
  middlewares?: MiddlewareType[];
}
