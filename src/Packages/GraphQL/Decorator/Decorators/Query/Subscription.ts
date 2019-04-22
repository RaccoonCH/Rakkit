import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  TypeFn
} from "../../../../..";

export function Subscription(topics: string[]);
export function Subscription(type: TypeFn, ...topics: string[]);
export function Subscription(typeOrTopics?: TypeFn | string[], ...topics: string[]) {
  const isType = typeof typeOrTopics === "function";
  return DecoratorHelper.getAddResolveDecorator(
    isType ? typeOrTopics as TypeFn : undefined,
    undefined,
    isType ? topics : typeOrTopics as string[],
    "Subscription"
  );
}
