import { MetadataStorage } from "../..";

export function Resolver(): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddResolver({
      class: target,
      key: target.name,
      category: "gql",
      params: {
        generic: false,
        gqlTypeName: "Query"
      }
    });
  };
}
