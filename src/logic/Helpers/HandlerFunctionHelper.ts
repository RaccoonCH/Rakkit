import { Middleware } from "koa";
import { HandlerFunction, Context, NextFunction } from "../../types";

export class HandlerFunctionHelper {
  static getWrappedHandlerFunction(handler: HandlerFunction): Middleware {
    return (context: Context, next: NextFunction) => {
      handler(context, next);
    };
  }
}
