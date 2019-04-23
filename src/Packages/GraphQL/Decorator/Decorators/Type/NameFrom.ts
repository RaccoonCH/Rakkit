import {
  MetadataStorage,
  IDecorator,
  IGqlType
} from "../../../../..";

export function NameFrom(...types: Function[]): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddTypeSetter({
      originalClass: target,
      class: target,
      key: target.name,
      category: "gql",
      params: (type: IDecorator<IGqlType>) => ({
        name: type.params.name + types.reduce((prev, classType) => {
          types;
          const gqlTypeDef = MetadataStorage.Instance.Gql.GetOneGqlTypeDef(
            classType,
            type.params.gqlType
          );
          if (gqlTypeDef) {
            return prev + gqlTypeDef.params.name;
          }
          return "_TYPE_NAME_NOT_FOUND";
        }, "")
      })
    });
  };
}
