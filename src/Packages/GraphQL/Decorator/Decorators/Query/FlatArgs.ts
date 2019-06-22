import {
  IArg,
  MetadataStorage,
  IDecorator,
  IField,
  TypeFn,
  DecoratorHelper
} from "../../../../..";

/**
 * Use it to inject a service instance (singleton), to the variable.
 */
export function FlatArgs();
export function FlatArgs(type: TypeFn);
export function FlatArgs(type?: TypeFn) {
  return (target: Object, key: string, index: number): void => {
    const reflectType = () => Reflect.getMetadata("design:paramtypes", target, key)[index];
    const typeInfos = DecoratorHelper.getTypeInfos(type, reflectType);

    MetadataStorage.Instance.Gql.AddFieldSetter({
      category: "gql",
      class: target.constructor,
      originalClass: target.constructor,
      key,
      params: (field: IDecorator<IField>) => {
        const newArg: IArg = {
          type: typeInfos.type,
          index,
          flat: true,
          name: index.toString(),
          arrayDepth: 0,
          nullable: false,
          arrayNullable: []
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
