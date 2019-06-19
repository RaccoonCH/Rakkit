import { GraphQLInterfaceType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  IInterfaceTypeParams
} from "../../../../..";

export function InterfaceType();
export function InterfaceType(params: IInterfaceTypeParams);
export function InterfaceType(name: string);
export function InterfaceType(name: string, params: IInterfaceTypeParams);
export function InterfaceType(nameOrParams?: string | IInterfaceTypeParams, params?: IInterfaceTypeParams): Function {
  return DecoratorHelper.getAddTypeDecorator(
    GraphQLInterfaceType,
    nameOrParams,
    params
  );
}
