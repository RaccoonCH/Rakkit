import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  TypeFn
} from "../../../../..";
import { MetadataStorage } from "../../../../../Logic";

export function Subscription(topic: string);
export function Subscription(topic: string) {
  return (target: Object, key: string, desciptor: PropertyDescriptor) => {
    // return MetadataStorage.Instance.Gql.AddField({
    //   category: "gql",
    //   class: target.constructor,
    //   key,
    //   originalClass: target.constructor,
    //   params: {
    //   }
    // });
  };
}
