import { BaseMiddleware, MiddlewareFunction } from "@types";

export type MiddlewareType = typeof BaseMiddleware | MiddlewareFunction;
