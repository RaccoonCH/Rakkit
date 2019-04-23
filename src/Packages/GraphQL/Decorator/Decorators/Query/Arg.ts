import {
  TypeFn,
  IArg,
  IArgParams,
  MetadataStorage,
  IDecorator,
  IField
} from "../../../../..";

/**
 * Use it to inject a service instance (singleton), to the variable.
 */
export function Arg();
export function Arg(type: TypeFn);
export function Arg(params: IArgParams);
export function Arg(type: TypeFn, params: IArgParams);
export function Arg(typeOrParams?: TypeFn | IArgParams, params?: IArgParams) {
  return (target: Object, key: string, index?: number): void => {
    const isType = typeof typeOrParams === "function";
    const definedType = isType ? typeOrParams as TypeFn : () => Reflect.getMetadata("design:paramtypes", target, key)[index];
    const definedParams = isType ? params : typeOrParams;
    const reflectType: Function = Reflect.getMetadata("design:paramtypes", target, key)[index];
    MetadataStorage.Instance.Gql.AddFieldSetter({
      category: "gql",
      class: target.constructor,
      originalClass: target.constructor,
      key,
      params: (field: IDecorator<IField>) => {
        const newArg: IArg = {
          type: definedType,
          index,
          name: `param${index}`,
          flat: false,
          isArray: Array.isArray(reflectType.prototype),
          nullable: false,
          ...definedParams
        };
        if (field.params.args) {
          return {
            args: [
              newArg,
              ...field.params.args
            ]
          };
        }
      }
    });
  };
}
