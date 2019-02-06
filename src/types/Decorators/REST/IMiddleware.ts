import { MiddlewareExecutionTime, HandlerFunction } from "@types";

export interface IMiddleware {
  executionTime: MiddlewareExecutionTime;
  function: HandlerFunction;
}
