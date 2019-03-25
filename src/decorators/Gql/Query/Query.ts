import { MetadataStorage, TypeFn } from "../../..";

export function Query();
export function Query(type: TypeFn);
export function Query(name: string);
export function Query(type: TypeFn, name: string);
export function Query(typeOrName?: TypeFn | string, name?: string) {
  // TODO: Name
  const isType = typeof typeOrName === "function";
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    const baseType = () => Reflect.getMetadata("design:returntype", target, key);
    const definedName = (isType ? name : typeOrName as string) || key;
    const definedType = isType ? typeOrName as TypeFn : baseType;
    MetadataStorage.Instance.Gql.AddField({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        name: definedName,
        args: [],
        partial: false,
        required: false,
        function: descriptor.value,
        deprecationReason: undefined,
        type: definedType,
        isArray: false,
        nullable: false
      }
    });
  };
}
