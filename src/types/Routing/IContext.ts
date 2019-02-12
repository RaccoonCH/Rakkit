import { Request, Response } from "express";
import { IGraphQLContext } from "@types";

export interface IContext extends Partial<IGraphQLContext> {
  type: "rest" | "gql";
  req: Request;
  res: Response;
  user?: any;
}
