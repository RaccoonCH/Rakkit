import { MetadataStorage } from "../..";

export function InterfaceType(): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddType({
      class: target,
      key: target.name,
      category: "gql",
      params: {
        gqlTypeName: "InterfaceType",
        generic: false
      }
    });
  };
}
