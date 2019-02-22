import { MiddlewareType } from "../../types";
import { MetadataStorage } from "../../logic";

/**
 * Use some middlewares to execute before the endpoint method
 */
export function UseMiddleware(...middlewares: MiddlewareType[]) {
  return (prototype: Function | Object, propertyKey?, descriptor?: TypedPropertyDescriptor<any>) => {
    const mw = {
      target: propertyKey ? prototype.constructor : prototype,
      fieldName: propertyKey || (prototype as Function).name,
      isClass: !propertyKey,
      middlewares
    };

    MetadataStorage.Instance.AddUsedMiddleware({
      class: mw.target,
      key: mw.fieldName,
      params: {
        applyOn: mw.isClass ? prototype : descriptor!.value,
        isClass: mw.isClass,
        middlewares
      }
    });
  };
}
