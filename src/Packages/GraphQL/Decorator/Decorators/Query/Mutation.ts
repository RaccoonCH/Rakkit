import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  TypeFn,
  IFieldParams
} from "../../../../..";

export function Mutation();
export function Mutation(type: TypeFn);
export function Mutation(params: IFieldParams);
export function Mutation(type: TypeFn, params?: IFieldParams);
export function Mutation(typeOrParams?: TypeFn | IFieldParams, params?: IFieldParams) {
  return DecoratorHelper.getAddResolveDecorator(typeOrParams, params, "Mutation");
}
