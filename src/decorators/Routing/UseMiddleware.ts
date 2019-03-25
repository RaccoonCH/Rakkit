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

    MetadataStorage.Instance.Routing.AddUsedMiddleware({
      class: (mw.target as Function),
      key: mw.fieldName,
      category: "routing",
      params: {
        applyOn: mw.isClass ? prototype : descriptor!.value,
        isClass: mw.isClass,
        middlewares
      }
    });
  };
}
