import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  TypeFn,
  ISubscriptionParams
} from "../../../../..";

export function Subscription();
export function Subscription(type: TypeFn);
export function Subscription(params: ISubscriptionParams);
export function Subscription(type: TypeFn, params: ISubscriptionParams);
export function Subscription(typeOrParams?: TypeFn | ISubscriptionParams, params?: ISubscriptionParams) {
  return DecoratorHelper.getAddFieldDecorator(typeOrParams, params, "Subscription");
}
