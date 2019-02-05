import { BaseMiddleware, MiddlewareFunction, IType } from "@types";

export type MiddlewareType = IType<BaseMiddleware> | MiddlewareFunction;
