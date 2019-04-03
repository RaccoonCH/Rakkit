import { GraphQLInterfaceType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  IGqlTypeParams
} from "../../../../..";

export function InterfaceType();
export function InterfaceType(params: IGqlTypeParams);
export function InterfaceType(name: string);
export function InterfaceType(name: string, params: IGqlTypeParams);
export function InterfaceType(nameOrParams?: string | IGqlTypeParams, params?: IGqlTypeParams): Function {
  return DecoratorHelper.getAddTypeDecorator<IGqlTypeParams>(
    GraphQLInterfaceType,
    nameOrParams,
    params
  );
}
