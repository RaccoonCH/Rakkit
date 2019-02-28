import {
  MiddlewareType,
  WsOptions
} from "../..";

export type ClassOrString = (Function | string);

export interface IAppConfig {
  silent?: boolean;
  host?: string;
  port?: number;
  restEndpoint?: string;
  socketioOptions?: WsOptions;
  routers?: ClassOrString[];
  websockets?: ClassOrString[];
  globalRestMiddlewares?: MiddlewareType[];
  globalRootMiddlewares?: MiddlewareType[];
}
