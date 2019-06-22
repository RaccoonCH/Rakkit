import { GraphQLObjectType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  MetadataStorage,
  IGqlTypeParams,
  TypeFn,
  IGqlType
} from "../../../../..";

export function Resolver(params?: IGqlTypeParams): Function;
export function Resolver(of: TypeFn, params?: IGqlTypeParams): Function;
export function Resolver(ofOrParams?: TypeFn | IGqlTypeParams, params?: IGqlTypeParams): Function {
  return (target: Function): void => {
    const isOf = typeof ofOrParams === "function";
    const definedOf = isOf ? ofOrParams as Function : undefined;
    const definedParams: Partial<IGqlType> = (isOf ? params : ofOrParams as IGqlTypeParams) || {};
    definedParams.ofType = definedOf;

    MetadataStorage.Instance.Gql.AddResolver(
      DecoratorHelper.getAddTypeParams(target, GraphQLObjectType, "Query", definedParams)
    );
  };
}
