import { Context, Middleware } from "koa";
import { HandlerFunction, IContext, NextFunction } from "../../types";

export class HandlerFunctionHelper {
  static getWrappedHandlerFunction(handler: HandlerFunction): Middleware {
    return (context: Context, next: NextFunction) => {
      const ctx: IContext = {
        type: "rest",
        context
      };
      handler(ctx, next);
    };
  }
}
