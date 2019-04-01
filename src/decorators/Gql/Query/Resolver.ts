import { GraphQLObjectType } from "graphql";
import { DecoratorHelper, MetadataStorage } from "../../../logic";

export function Resolver(): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddResolver(
      DecoratorHelper.getAddTypeParams(target, GraphQLObjectType, "Query")
    );
  };
}
