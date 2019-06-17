import {
  IFieldParams,
  Topic,
  ISubscriptionFnParams
} from "../../..";

export interface ISubscriptionParams extends IFieldParams {
  topics?: Topic;
  subscribe?: (params: ISubscriptionFnParams) => AsyncIterator<any>;
  withFilter?: (params: ISubscriptionFnParams) => boolean | Promise<boolean>;
}
