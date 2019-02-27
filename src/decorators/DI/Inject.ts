import { MetadataStorage } from "../../logic";
import { DiId } from "../..";

/**
 * Use it to inject a service instance (singleton), to the variable.
 */
export function Inject(id?: DiId);
export function Inject(arrayType: Function, ...ids: DiId[]);
export function Inject(arraytypeOrId?: Function | DiId, ...ids: (DiId[] | undefined)): Function {
  return (target: Object, key: string, index?: number): void => {
    const type = Reflect.getMetadata("design:type", target, key);
    const isTypeAnArray = Array.isArray(type.prototype);
    const isParamsAnArray = typeof arraytypeOrId === "function";
    const serviceType = isTypeAnArray ? arraytypeOrId : type;
    const isArray = isParamsAnArray && isTypeAnArray;
    if (isArray || (!isParamsAnArray && !isTypeAnArray)) {
      const finalIds = isArray ? ids : [ (arraytypeOrId as DiId) || undefined ];
      MetadataStorage.Instance.AddInjection({
        class: target.constructor,
        key,
        params: {
          isArray,
          ids: finalIds,
          injectionType: (serviceType as Function)
        }
      });
    } else {
      throw new Error(`
      Injection inconsistency type, declare the type as an array if you want to inject multiple values
      on ${target.constructor.name} at the property ${key}
      `);
    }
  };
}
