import { MetadataStorage } from "../..";

export function ObjectType(...interfaces: Function[]): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddType({
      class: target,
      key: target.name,
      category: "gql",
      params: {
        gqlTypeName: "ObjectType",
        interfaces: interfaces || [],
        generic: false
      }
    });
  };
}
