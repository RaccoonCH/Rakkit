import { IContext, NextFunction } from "@types";

export abstract class BaseMiddleware {
  abstract use(context: IContext, next: NextFunction): Promise<void> | void;
}
