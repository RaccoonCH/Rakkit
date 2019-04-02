import { GraphQLObjectType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  MetadataStorage
} from "../../../../..";

export function Resolver(): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddResolver(
      DecoratorHelper.getAddTypeParams(target, GraphQLObjectType, "Query")
    );
  };
}
