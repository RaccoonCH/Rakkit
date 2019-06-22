import {
  KeyValue,
  IContext,
  ISubscriptionFnParams
} from "../../..";

export type Topic =
  string |
  string[] |
  ((params: ISubscriptionFnParams) => (string | string[]));
