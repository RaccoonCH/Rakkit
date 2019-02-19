import { IMain, MiddlewareType } from "../..";

export type ClassOrString = (Function | string);

export interface IAppConfig {
  jwtSecret?: string;
  startOptions?: IMain;
  resolvers?: ClassOrString[];
  routers?: ClassOrString[];
  websockets?: ClassOrString[];
  globalMiddlewares?: MiddlewareType[];
  ormConnection?: Function;
}
