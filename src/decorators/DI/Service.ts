import { MetadataStorage } from "../../logic";
import { IClassType } from "../../types";

/**
 * Declare a service that is a singleton, an instance is initialized and
 * you can access to it by the @Inject middleware in a class or a another service.
 */
export const Service = (id?: string | number): Function => {
  return (target: Function): void => {
    MetadataStorage.Instance.AddService({
      class: target,
      key: target.name,
      params: {
        id,
        instance: new (target as IClassType<any>)()
      }
    });
  };
};
