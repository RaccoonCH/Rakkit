import { IBaseMiddleware } from "@types";

export interface IMiddlewareClass {
  new (...args: any[]): IBaseMiddleware;
}
