import { Middleware } from "koa";
import { HandlerFunction, Context, NextFunction } from "../../types";

export class HandlerFunctionHelper {
  static getWrappedHandlerFunction(handler: HandlerFunction): Middleware {
    return async (context: Context, next: NextFunction) => {
      await handler(context, next);
    };
  }
}
