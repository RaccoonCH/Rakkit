import { MetadataStorage } from "../..";

export function Query() {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    const baseType = () => Reflect.getMetadata("design:returntype", target, key);
    MetadataStorage.Instance.Gql.AddQuery({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        function: descriptor.value,
        type: baseType,
        isArray: false,
        nullable: false
      }
    });
  };
}
