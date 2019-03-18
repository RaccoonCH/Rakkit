import { MetadataStorage } from "../..";

export function Field() {
  return (target: Object, key: string, descriptor?: PropertyDescriptor): void => {
    const baseType = () => Reflect.getMetadata("design:type", target, key);
    MetadataStorage.Instance.Gql.AddField({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        type: baseType,
        isArray: false,
        nullable: false
      }
    });
  };
}
