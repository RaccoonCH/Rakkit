import {
  MiddlewareType,
  ClassOrString
} from "../../..";

export interface IGqlConfig {
  resolvers: ClassOrString[];
  globalMiddlewares: MiddlewareType[];
}
