import { IBaseMiddleware } from "..";

export interface IMiddlewareClass {
  new (...args: any[]): IBaseMiddleware;
}
