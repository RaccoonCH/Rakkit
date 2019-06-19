import {
  IFieldParams,
  Topic,
  ISubscriptionFnParams
} from "../../..";

export interface ISubscriptionParams extends IFieldParams {
  topics?: Topic;
  subscribe?: (params: ISubscriptionFnParams) => AsyncIterator<any>;
  filter?: (params: ISubscriptionFnParams) => boolean | Promise<boolean>;
}
