import { PubSubEngine } from "graphql-subscriptions";
import {
  MiddlewareType,
  ClassOrString,
  IScalarAssociation,
  GqlResolveType
} from "../../..";

export interface IGqlConfig {
  resolvers: ClassOrString[];
  globalMiddlewares: MiddlewareType[];
  nullableByDefault: boolean;
  scalarsMap: IScalarAssociation[];
  dateMode: "isoDate" | "timestamp";
  pubSub: PubSubEngine;
  emitSchemaFile: string;
  globalMiddlewaresExclude: GqlResolveType[];
}
