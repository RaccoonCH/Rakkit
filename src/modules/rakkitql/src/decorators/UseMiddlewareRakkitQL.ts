import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getArrayFromOverloadedRest } from "../helpers/decorators";
import { SymbolKeysNotSupportedError } from "../errors";
import { MiddlewareType } from "../../../../types";
import { AnyDecorator } from "./types";

export function UseMiddlewareRakkitQL(middlewares: MiddlewareType[]): AnyDecorator;
export function UseMiddlewareRakkitQL(...middlewares: MiddlewareType[]): AnyDecorator;
export function UseMiddlewareRakkitQL(
  ...middlewaresOrMiddlewareArray: Array<MiddlewareType[] | MiddlewareType>
): AnyDecorator {
  const middlewares = getArrayFromOverloadedRest(middlewaresOrMiddlewareArray);

  return (prototype: Function, propertyKey?, descriptor?) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectMiddlewareMetadata({
      target: propertyKey ? prototype.constructor : prototype,
      fieldName: propertyKey || prototype.name,
      isClass: !propertyKey,
      middlewares,
    });
  };
}
