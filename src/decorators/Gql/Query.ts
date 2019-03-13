import { MetadataStorage } from "../..";

export function Query() {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    MetadataStorage.Instance.Gql.AddQuery({
      class: target.constructor,
      key,
      category: "gql",
      params: {
        function: descriptor.value
      }
    });
  };
}
