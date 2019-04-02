import { IContext, NextFunction } from "..";

export type HandlerFunction = (
  context: IContext,
  next: NextFunction
) => Promise<any>;
