import { NextFunction, Request, Response } from "express";

export type Action = ((req: Request, res: Response, next: NextFunction) => any) | ((req: Request, res: Response) => any);
