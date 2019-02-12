import { SymbolKeysNotSupportedError } from "../errors";
import { Middleware } from "../interfaces/Middleware";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getArrayFromOverloadedRest } from "../helpers/decorators";
import { MethodAndPropDecorator } from "./types";
import { MiddlewareType } from "@types";

export function UseMiddleware(middlewares: MiddlewareType[]): MethodAndPropDecorator;
export function UseMiddleware(...middlewares: MiddlewareType[]): MethodAndPropDecorator;
export function UseMiddleware(
  ...middlewaresOrMiddlewareArray: Array<MiddlewareType[] | MiddlewareType>
): MethodDecorator | PropertyDecorator {
  const middlewares = getArrayFromOverloadedRest(middlewaresOrMiddlewareArray);

  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectMiddlewareMetadata({
      target: prototype.constructor,
      fieldName: propertyKey,
      middlewares,
    });
  };
}
