import { MetadataStorage } from "../../..";

export function Query() {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    const baseType = () => Reflect.getMetadata("design:returntype", target, key);
    MetadataStorage.Instance.Gql.AddField({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        partial: false,
        required: false,
        function: descriptor.value,
        deprecationReason: undefined,
        type: baseType,
        isArray: false,
        nullable: false
      }
    });
  };
}
