import { PubSubEngine } from "graphql-subscriptions";
import { GraphQLResolveInfo } from "graphql";
import { KeyValue, GqlResolveType } from "../../..";

export interface IGqlContext<ResponseType = any, RootType = any> {
  pubSub: PubSubEngine;
  args: KeyValue;
  rawArgs: KeyValue;
  info: GraphQLResolveInfo;
  root: RootType;
  response: ResponseType;
  queryType: GqlResolveType;
}
