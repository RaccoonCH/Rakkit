import { MiddlewareType, HttpMethod } from "../..";
import { ClassType } from "class-transformer/ClassTransformer";

export interface IEndpoint {
  endpoint: string;
  method: HttpMethod;
  functions: Function[];
  middlewares?: MiddlewareType[];
}
