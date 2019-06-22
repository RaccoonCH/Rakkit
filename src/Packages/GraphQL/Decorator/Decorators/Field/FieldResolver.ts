import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  TypeFn,
  IFieldParams
} from "../../../../..";

export function FieldResolver();
export function FieldResolver(type: TypeFn);
export function FieldResolver(params: IFieldParams);
export function FieldResolver(type: TypeFn, params: IFieldParams);
export function FieldResolver(typeOrParams?: TypeFn | IFieldParams, params?: IFieldParams) {
  return DecoratorHelper.getAddFieldDecorator(typeOrParams, params, "FieldResolver");
}
