import { MetadataStorage } from "../../logic";
import { IClassType, DiId } from "../../types";

/**
 * Declare a service that is a singleton, an instance is initialized and
 * you can access to it by the @Inject middleware in a class or a another service.
 */
export const Service = (...ids: DiId[]): Function => {
  return (target: Function): void => {
    const finalIds = ids.length <= 0 || !ids ? [ undefined ] : ids;
    finalIds.map((id) => {
      MetadataStorage.Instance.AddService({
        class: target,
        key: target.name,
        params: {
          id,
          instance: new (target as IClassType<any>)()
        }
      });
    });
  };
};
