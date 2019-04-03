import { GraphQLInputObjectType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  IGqlTypeParams
} from "../../../../..";

export function InputType();
export function InputType(params: IGqlTypeParams);
export function InputType(name: string);
export function InputType(name: string, params: IGqlTypeParams);
export function InputType(nameOrParams?: string | IGqlTypeParams, params?: IGqlTypeParams): Function {
  return DecoratorHelper.getAddTypeDecorator<IGqlTypeParams>(
    GraphQLInputObjectType,
    nameOrParams,
    params
  );
}
