import { MetadataStorage, INamed, IClassType } from "../../..";

export function GenericName(...types: IClassType<any>[]): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddTypeSetter<INamed>({
      class: target,
      key: target.name,
      category: "gql",
      params: {
        name: target.name + types.reduce((prev, type) => prev + type.name, "")
      }
    });
  };
}
