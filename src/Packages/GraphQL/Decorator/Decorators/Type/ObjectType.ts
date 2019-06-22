import { GraphQLObjectType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  IObjectTypeParams
} from "../../../../..";

export function ObjectType();
export function ObjectType(params: IObjectTypeParams);
export function ObjectType(name: string);
export function ObjectType(name: string, params: IObjectTypeParams);
export function ObjectType(nameOrParams?: string | IObjectTypeParams, params?: IObjectTypeParams): Function {
  return DecoratorHelper.getAddTypeDecorator(
    GraphQLObjectType,
    nameOrParams,
    params
  );
}
