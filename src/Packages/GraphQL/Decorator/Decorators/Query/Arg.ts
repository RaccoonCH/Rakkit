import {
  TypeFn,
  IArg,
  IArgParams,
  MetadataStorage,
  IDecorator,
  IField,
  DecoratorHelper
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
    const definedParams = isType ? params : typeOrParams;
    const definedType = isType ? typeOrParams as TypeFn : undefined;
    const reflectType = () => Reflect.getMetadata("design:paramtypes", target, key)[index];
    const typeInfos = DecoratorHelper.getTypeInfos(definedType, reflectType);

    MetadataStorage.Instance.Gql.AddFieldSetter({
      category: "gql",
      class: target.constructor,
      originalClass: target.constructor,
      key,
      params: (field: IDecorator<IField>) => {
        const newArg: IArg = {
          type: typeInfos.type,
          index,
          name: `param${index}`,
          flat: false,
          arrayDepth: typeInfos.arrayDepth,
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
