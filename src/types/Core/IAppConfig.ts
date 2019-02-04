import { BaseMiddleware, IMain, IType } from "@types";

export type ClassOrString = (Function | string);

export interface IAppConfig {
  jwtSecret?: string;
  startOptions?: IMain;
  resolvers?: ClassOrString[];
  routers?: ClassOrString[];
  globalMiddlwares?: (IType<BaseMiddleware>)[];
  ormConnection?: Function;
}
