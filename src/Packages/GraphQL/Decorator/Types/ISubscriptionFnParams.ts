import { KeyValue, IContext } from "../../../..";
import { PubSubEngine } from "graphql-subscriptions";
import { GraphQLResolveInfo } from "graphql";

export interface ISubscriptionFnParams {
  payload: any;
  args: KeyValue;
  pubSub: PubSubEngine;
  infos: GraphQLResolveInfo;
  context?: IContext;
}
