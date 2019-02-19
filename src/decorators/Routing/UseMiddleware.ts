import {
  getMetadataStorage,
  AnyDecorator,
  SymbolKeysNotSupportedError
} from "../../modules/rakkitql";
import { MiddlewareType } from "../../types";
import { DecoratorStorage } from "../../logic";

export function UseMiddleware(
  ...middlewares: MiddlewareType[]
): AnyDecorator {
  return (prototype: Function, propertyKey?, descriptor?: TypedPropertyDescriptor<any>) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    const mw = {
      target: propertyKey ? prototype.constructor : prototype,
      fieldName: propertyKey || prototype.name,
      isClass: !propertyKey,
      middlewares
    };

    getMetadataStorage().collectMiddlewareMetadata(mw);

    DecoratorStorage.Instance.AddUsedMiddleware({
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
