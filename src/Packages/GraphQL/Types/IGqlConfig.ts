import { PubSubEngine } from "graphql-subscriptions";
import { GraphQLScalarType } from "graphql";
import {
  MiddlewareType,
  ClassOrString
} from "../../..";

export interface IGqlConfig {
  resolvers: ClassOrString[];
  globalMiddlewares: MiddlewareType[];
  nullableByDefault: boolean;
  scalarMap: [Function, GraphQLScalarType][];
  dateMode: "iso" | "timestamp";
  pubSub: PubSubEngine;
  exportSchemaFileTo: string;
}
