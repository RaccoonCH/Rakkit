import { MiddlewareType } from "../..";

export type ClassOrString = (Function | string);

export interface IAppConfig {
  silent?: boolean;
  corsEnabled?: boolean;
  host?: string;
  port?: number;
  publicPath?: string;
  restEndpoint?: string;
  wsEndpoint?: string;
  routers?: ClassOrString[];
  websockets?: ClassOrString[];
  globalMiddlewares?: MiddlewareType[];
}
