import {
  MetadataStorage,
  IClassType,
  IDecorator,
  IGqlType,
  INamed
} from "../../..";

export function NameFrom(...types: IClassType<any>[]): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddTypeSetter({
      originalClass: target,
      class: target,
      key: target.name,
      category: "gql",
      params: (type: IDecorator<IGqlType>) => ({
        name: type.params.name + types.reduce((prev, classType) => {
          const gqlTypeDef = MetadataStorage.Instance.Gql.GetOneGqlTypeDef(classType, type.params.gqlType);
          if (gqlTypeDef) {
            return prev + gqlTypeDef.params.name;
          }
          return "_";
        }, "")
      })
    });
  };
}
