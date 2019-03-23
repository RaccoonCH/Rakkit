import { Middleware } from "koa";
import { HandlerFunction, IContext, NextFunction } from "../../types";

export class HandlerFunctionHelper {
  static getWrappedHandlerFunction(handler: HandlerFunction): Middleware {
    return async (context: IContext, next: NextFunction) => {
      await handler(context, next);
    };
  }
}
