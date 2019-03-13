import { MetadataStorage } from "../..";

export function ObjectType(): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddType({
      class: target,
      key: target.name,
      category: "gql",
      params: {
        type: "ObjectType"
      }
    });
  };
}
