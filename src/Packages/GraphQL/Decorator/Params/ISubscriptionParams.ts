import {
  IFieldParams,
  Topic
} from "../..";

export interface ISubscriptionParams extends IFieldParams {
  topics: Topic;
}
