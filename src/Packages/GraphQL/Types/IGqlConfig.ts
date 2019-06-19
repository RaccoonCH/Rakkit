import { PubSubEngine } from "graphql-subscriptions";
import {
  MiddlewareType,
  ClassOrString,
  IScalarAssociation
} from "../../..";

export interface IGqlConfig {
  resolvers: ClassOrString[];
  globalMiddlewares: MiddlewareType[];
  nullableByDefault: boolean;
  scalarsMap: IScalarAssociation[];
  dateMode: "isoDate" | "timestamp";
  pubSub: PubSubEngine;
  exportSchemaFileTo: string;
}
