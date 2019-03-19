import { MetadataStorage, IGeneric } from "../..";

export function GenericType(): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddTypeSetter<IGeneric>({
      class: target,
      key: target.name,
      category: "gql",
      params: {
        generic: true
      }
    });
  };
}
