import { MetadataStorage } from "../..";

export function InputType(): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddType({
      class: target,
      key: target.name,
      category: "gql",
      params: {
        type: "InputType"
      }
    });
  };
}
