import {
  MiddlewareType,
  CorsOptions,
  PublicOptions
} from "../..";

export type ClassOrString = (Function | string);

export interface IAppConfig {
  silent?: boolean;
  cors?: CorsOptions;
  host?: string;
  port?: number;
  public?: PublicOptions;
  restEndpoint?: string;
  wsEndpoint?: string;
  routers?: ClassOrString[];
  websockets?: ClassOrString[];
  globalMiddlewares?: MiddlewareType[];
}
