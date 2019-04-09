import { PubSubEngine } from "graphql-subscriptions";
import { GraphQLResolveInfo } from "graphql";
import { KeyValue, GqlResolveType } from "../../..";

export interface IGqlContext<ResponseType> {
  pubSub: PubSubEngine;
  args: KeyValue;
  rawArgs: KeyValue;
  info: GraphQLResolveInfo;
  root: any;
  response: ResponseType;
  queryType: GqlResolveType;
}
