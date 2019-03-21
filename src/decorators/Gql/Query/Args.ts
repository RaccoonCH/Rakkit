import {
  Param, TypeFn
} from "../../..";
import { MetadataStorage } from '../../../logic';
import { IQuery } from '../../../types';

/**
 * Use it to inject a service instance (singleton), to the variable.
 */
export function Args(type?: TypeFn) {
  return (target: Object, key: string, index?: number): void => {
    MetadataStorage.Instance.Gql.AddFieldSetter<Partial<IQuery>>({
      category: "gql",
      class: target.constructor,
      key,
      params: {
        args: type || (() => Reflect.getMetadata("design:paramtypes", target, key)[0])
      }
    });
  };
}
