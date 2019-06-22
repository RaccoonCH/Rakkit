import {
  MiddlewareType,
  ClassOrString
} from "../../..";

export interface IRestConfig {
  routers: ClassOrString[];
  endpoint: string;
  globalRestMiddlewares: MiddlewareType[];
  globalRootMiddlewares: MiddlewareType[];
  globalAppMiddlewares: MiddlewareType[];
}
