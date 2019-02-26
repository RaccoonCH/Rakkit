import { Context } from "koa";

export type Context = Context & {
  params: {
    [objKey: string]: string
  };
};
