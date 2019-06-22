import {
  MetadataStorage,
  IDecorator,
  IGqlType,
  Color
} from "../../../../..";

export function ConcatName(...types: Function[]): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddTypeSetter({
      originalClass: target,
      class: target,
      key: target.name,
      category: "gql",
      params: (type: IDecorator<IGqlType>) => {
        target.name;
        const suffix = types.reduce((prev, classType) => {
          types;
          const gqlTypeDef = MetadataStorage.Instance.Gql.GetOneGqlTypeDef(
            classType,
            type.params.gqlType
          );
          if (gqlTypeDef) {
            return prev + gqlTypeDef.params.name;
          } else {
            const getName = (classType: Function) => classType.name || classType();
            console.log(
              // tslint:disable-next-line:prefer-template
              "\n" +
              Color(
                `WARNING - @ConcatName(${types.map(getName).join(", ")})\n` +
                `The type ${getName(classType)} is not found with the gqlType ${type.params.gqlType.name}`
              , "bg.red", "fg.black") +
              "\n"
            );
          }
          return "";
        }, "");

        return {
          name: type.params.name + suffix
        };
      }
    });
  };
}
