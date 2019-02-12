import { BaseMiddleware, HandlerFunction, IType } from "@types";

export type MiddlewareType = IType<BaseMiddleware> | HandlerFunction;
