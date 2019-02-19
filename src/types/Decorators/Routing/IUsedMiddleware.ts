import { MiddlewareType } from "../..";

export interface IUsedMiddleware {
  applyOn: Function;
  isClass: boolean;
  middlewares: MiddlewareType[];
}
