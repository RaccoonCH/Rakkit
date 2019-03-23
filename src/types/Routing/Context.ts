import { Context } from "koa";
import { KeyValue } from "../..";

export type Context = Context & {
  // apiType: "gql" | "rest",
  // gqlArgs?: KeyValue;
  params: KeyValue;
};
