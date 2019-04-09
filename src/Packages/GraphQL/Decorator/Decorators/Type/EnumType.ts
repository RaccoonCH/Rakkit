import { GraphQLEnumType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  IObjectTypeParams
} from "../../../../..";

export function EnumType();
export function EnumType(params: IObjectTypeParams);
export function EnumType(name: string);
export function EnumType(name: string, params: IObjectTypeParams);
export function EnumType(nameOrParams?: string | IObjectTypeParams, params?: IObjectTypeParams): Function {
  return DecoratorHelper.getAddTypeDecorator(
    GraphQLEnumType,
    nameOrParams,
    params
  );
}
