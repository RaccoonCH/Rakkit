import { NextFunction, Request, Response } from "express";
import { HandlerFunction, IContext } from "@types";

export class HandlerFunctionHelper {
  static getWrappedHandlerFunction(handler: HandlerFunction) {
    return (req: Request, res: Response, next: NextFunction) => {
      const context: IContext = {
        req,
        res,
        next,
        user: req.user
      };
      handler(context);
    };
  }
}
