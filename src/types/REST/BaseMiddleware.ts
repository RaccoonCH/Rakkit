import { NextFunction } from "express";
import { IContext } from "@types";

export abstract class BaseMiddleware {
  abstract use(context: IContext, next: NextFunction);
}
