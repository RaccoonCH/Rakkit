import { IContext, NextFunction } from "..";

export type HandlerFunction = (
  context: Partial<IContext>,
  next: NextFunction
) => Promise<any> | any;
