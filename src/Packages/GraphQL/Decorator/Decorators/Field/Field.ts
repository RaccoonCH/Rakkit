import {
  TypeFn,
  IFieldParams,
  DecoratorHelper
} from "../../../../..";

export function Field();
export function Field(type: TypeFn);
export function Field(params: IFieldParams);
export function Field(type: TypeFn, params: IFieldParams);
export function Field(typeOrParams?: IFieldParams | TypeFn, params?: IFieldParams) {
  return DecoratorHelper.getAddFieldDecorator(typeOrParams, params, "Field");
}
