import {
  MetadataStorage,
  DiId,
  TypeFn,
  ArrayDiError
} from "../../../..";

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
      throw new ArrayDiError(
        target.constructor,
        key
      );
    }
    if (
      (isIdsAnArray && isArrayAtDefinition) ||
      (!isIdsAnArray && !isArrayAtDefinition) ||
      (isArrayAtDefinition && !isIdsAnArray) ||
      index
    ) {
      const finalIds = isTypeAtFirstParam ? ids : [ (typeOrId as DiId) || undefined ];
      const classType = index !== undefined ? (target as Function) : target.constructor;
      MetadataStorage.Instance.Di.AddInjection({
        originalClass: classType,
        class: classType,
        key,
        category: "di",
        params: {
          paramIndex: index,
          ids: finalIds,
          injectionType: serviceType,
          isArray: isArrayAtDefinition
        }
      });
    } else {
      const isOnConstructor = index !== undefined;
      throw new ArrayDiError(
        isOnConstructor ? target as Function : target.constructor,
        isOnConstructor ? "constructor" : key
      );
    }
  };
}
