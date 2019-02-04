import { Request, Response, NextFunction } from "express";

export abstract class BaseMiddleware {
  abstract use(req: Request, res: Response, next: NextFunction): any;
}
