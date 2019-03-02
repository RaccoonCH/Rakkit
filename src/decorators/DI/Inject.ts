import { MetadataStorage } from "../../logic";
import { DiId, TypeFn } from "../..";

/**
 * Use it to inject a service instance (singleton), to the variable.
 */
export function Inject();
export function Inject(id: DiId);
export function Inject(type: TypeFn, id: DiId);
export function Inject(arrayType: TypeFn, ...ids: DiId[]);
export function Inject(typeOrId?: Function | DiId, ...ids: (DiId[] | undefined)): Function {
  return (target: Object, key: string, index?: number): void => {
    const type = Reflect.getMetadata("design:type", target, key);
    const isTypeAtFirstParam = typeof typeOrId === "function";
    const isArrayAtDefinition = type ? Array.isArray(type.prototype) : false;
    const serviceType = isTypeAtFirstParam ? (typeOrId as Function) : () => type;
    const isIdsAnArray = ids.length > 1 && isTypeAtFirstParam;
    if (isArrayAtDefinition && !isTypeAtFirstParam) {
      throw new Error(`You must declare the type of your injection array on ${target.constructor.name} at ${key}`);
    }
    if (
      (isIdsAnArray && isArrayAtDefinition) ||
      (!isIdsAnArray && !isArrayAtDefinition) ||
      (isArrayAtDefinition && !isIdsAnArray) ||
      index
    ) {
      const finalIds = isTypeAtFirstParam ? ids : [ (typeOrId as DiId) || undefined ];
      MetadataStorage.Instance.AddInjection({
        class: index !== undefined ? target : target.constructor,
        key,
        params: {
          paramIndex: index,
          ids: finalIds,
          injectionType: serviceType,
          isArray: isArrayAtDefinition
        }
      });
    } else {
      throw new Error(`
      Injection inconsistency type, declare the type as an array if you want to inject multiple values
      on ${index !== undefined ? (target as Function).name : target.constructor.name} at the property ${index ? key : "constructor"}
      `);
    }
  };
}
