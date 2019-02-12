import { IContext, NextFunction } from "@types";

export type HandlerFunction = (context: IContext, next: NextFunction) => void;
