import { GraphQLEnumType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  IGqlTypeParams
} from "../../../../..";

export function EnumType();
export function EnumType(params: IGqlTypeParams);
export function EnumType(name: string);
export function EnumType(name: string, params: IGqlTypeParams);
export function EnumType(nameOrParams?: string | IGqlTypeParams, params?: IGqlTypeParams): Function {
  return DecoratorHelper.getAddTypeDecorator(
    GraphQLEnumType,
    nameOrParams,
    params
  );
}
