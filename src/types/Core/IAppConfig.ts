import {
  MiddlewareType,
  CorsOptions,
  PublicOptions,
  WsOptions
} from "../..";

export type ClassOrString = (Function | string);

export interface IAppConfig {
  silent?: boolean;
  cors?: CorsOptions;
  host?: string;
  port?: number;
  public?: PublicOptions;
  restEndpoint?: string;
  SocketioOptions?: WsOptions;
  routers?: ClassOrString[];
  websockets?: ClassOrString[];
  globalMiddlewares?: MiddlewareType[];
}
