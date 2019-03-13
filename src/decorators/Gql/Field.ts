import { MetadataStorage } from "../..";

export function Field() {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.Gql.AddField({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        isArray: false,
        nullable: false,
        type: String
      }
    });
  };
}
