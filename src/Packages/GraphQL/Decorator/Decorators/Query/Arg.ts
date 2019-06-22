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
export function Arg(name: string);
export function Arg(name: string, type: TypeFn);
export function Arg(name: string, params: IArgParams);
export function Arg(name: string, type: TypeFn, params: IArgParams);
export function Arg(name: string, typeOrParams?: TypeFn | IArgParams, params?: IArgParams) {
  return (target: Object, key: string, index: number): void => {
    const isType = typeof typeOrParams === "function";
    const definedParams = (isType ? params : typeOrParams as IArgParams) || {};
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
          name,
          flat: false,
          arrayDepth: typeInfos.arrayDepth,
          nullable: !!definedParams.defaultValue || definedParams.nullable,
          arrayNullable: [],
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
