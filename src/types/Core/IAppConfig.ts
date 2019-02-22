import { IMain, MiddlewareType } from "../..";

export type ClassOrString = (Function | string);

export interface IAppConfig {
  startOptions?: IMain;
  routers?: ClassOrString[];
  websockets?: ClassOrString[];
  globalMiddlewares?: MiddlewareType[];
}
