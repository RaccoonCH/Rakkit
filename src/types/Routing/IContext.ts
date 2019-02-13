import { IGraphQLContext } from "@types";
import { Context } from "koa";

export interface IContext extends Partial<IGraphQLContext> {
  type: "rest" | "gql";
  context: Context;
  user?: any;
}
