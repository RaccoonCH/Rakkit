import { KeyValue, IContext } from "../../../..";
import { PubSubEngine } from "graphql-subscriptions";

export interface ISubscriptionFnParams {
  payload: any;
  args: KeyValue;
  pubSub: PubSubEngine;
  context?: IContext;
}
