import { MetadataStorage, IClassType, IDecorator, IGqlType, INamed } from "../../..";

export function NameFrom(...types: IClassType<any>[]): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddTypeSetter({
      class: target,
      key: target.name,
      category: "gql",
      params: (
        type: IDecorator<IGqlType>
      ): INamed => ({
        name: type.params.name + types.reduce((prev, classType) => {
          const objectType = MetadataStorage.Instance.Gql.GetOneGqlType(classType, type.params.gqlTypeName);
          if (objectType) {
            return prev + objectType.params.name;
          }
          return "+";
        }, "")
      })
    });
  };
}
