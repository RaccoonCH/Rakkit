import { Context, NextFunction } from "..";

export type HandlerFunction = (
  context: Context,
  next: NextFunction
) => Promise<any>;
