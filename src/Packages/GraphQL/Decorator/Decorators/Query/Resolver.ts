import { GraphQLObjectType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  MetadataStorage,
  IGqlTypeParams
} from "../../../../..";

export function Resolver(params?: IGqlTypeParams): Function {
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddResolver(
      DecoratorHelper.getAddTypeParams(target, GraphQLObjectType, "Query", params)
    );
  };
}
