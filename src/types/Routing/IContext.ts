import { Context } from "koa";

export interface IContext {
  type: "rest";
  context: Context;
}
