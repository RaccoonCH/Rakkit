import { Request, Response, NextFunction } from "express";

export interface IContext {
  req: Request;
  res: Response;
  next: NextFunction;
  user?: any;
}
