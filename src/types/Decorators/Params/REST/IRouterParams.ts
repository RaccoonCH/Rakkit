import { MiddlewareType } from "../../..";

export interface IRouterParams {
  middlewares?: MiddlewareType[];
  extends?: Object;
}
