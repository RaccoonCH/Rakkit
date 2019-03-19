import { MetadataStorage } from "../..";

export function ArgsType(): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddType({
      class: target,
      key: target.name,
      category: "gql",
      params: {
        generic: false,
        gqlTypeName: "ArgsType"
      }
    });
  };
}
