import {
  MiddlewareType,
  WsOptions,
  ClassOrString
} from "..";

export interface IAppConfig {
  silent?: boolean;
  host?: string;
  port?: number;
  restEndpoint?: string;
  socketioOptions?: WsOptions;
  routers?: ClassOrString[];
  websockets?: ClassOrString[];
  resolvers?: ClassOrString[];
  globalRestMiddlewares?: MiddlewareType[];
  globalRootMiddlewares?: MiddlewareType[];
  appMiddlewares?: MiddlewareType[];
}
