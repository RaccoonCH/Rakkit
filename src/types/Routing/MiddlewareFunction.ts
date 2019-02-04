import { Response, Request, NextFunction } from "express";

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => any;
