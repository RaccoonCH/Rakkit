import {
  MiddlewareExecutionTime,
  HandlerFunction
} from "../..";

export interface IMiddleware {
  executionTime: MiddlewareExecutionTime;
  function: HandlerFunction;
  isClass: boolean;
}
