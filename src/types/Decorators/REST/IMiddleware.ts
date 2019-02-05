import { MiddlewareExecutionTime } from "@types";
import { RequestHandlerParams } from "express-serve-static-core";

export interface IMiddleware {
  executionTime: MiddlewareExecutionTime;
  function: RequestHandlerParams;
}
