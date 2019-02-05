import { MiddlewareType } from "@types";

export interface IRouterParams {
  middlewares?: MiddlewareType[];
  extends?: Object;
}
