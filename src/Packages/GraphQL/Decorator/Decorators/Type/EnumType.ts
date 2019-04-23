import { GraphQLEnumType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  IGqlObjectParams
} from "../../../../..";

export function EnumType();
export function EnumType(params: IGqlObjectParams);
export function EnumType(name: string);
export function EnumType(name: string, params: IGqlObjectParams);
export function EnumType(nameOrParams?: string | IGqlObjectParams, params?: IGqlObjectParams): Function {
  return DecoratorHelper.getAddTypeDecorator(
    GraphQLEnumType,
    nameOrParams,
    params
  );
}
