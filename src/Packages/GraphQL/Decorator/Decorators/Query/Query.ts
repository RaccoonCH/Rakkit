import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  TypeFn,
  IFieldParams
} from "../../../../..";

export function Query();
export function Query(type: TypeFn);
export function Query(params: IFieldParams);
export function Query(type: TypeFn, params: IFieldParams);
export function Query(typeOrParams?: TypeFn | IFieldParams, params?: IFieldParams) {
  return DecoratorHelper.getAddFieldDecorator(typeOrParams, params, "Query");
}
