import {
  MetadataStorage,
  DiId
} from "../../../..";

/**
 * Declare a service that is a singleton, an instance is initialized and
 * you can access to it by the @Inject middleware in a class or a another service.
 */
export function Service();
export function Service(...ids: DiId[]);
export function Service(...ids: DiId[]): Function {
  return (target: Function): void => {
    const finalIds = ids.length <= 0 || !ids ? [ undefined ] : ids;
    finalIds.map((id) => {
      MetadataStorage.Instance.Di.AddService({
        originalClass: target,
        class: target,
        key: target.name,
        category: "di",
        params: {
          id
        }
      });
    });
  };
}
