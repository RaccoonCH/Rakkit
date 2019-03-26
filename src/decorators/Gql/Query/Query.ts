import { TypeFn, DecoratorHelper } from "../../..";

export function Query();
export function Query(type: TypeFn);
export function Query(name: string);
export function Query(type: TypeFn, name: string);
export function Query(typeOrName?: TypeFn | string, name?: string) {
  return DecoratorHelper.getAddResolveDecorator(typeOrName, name);
}
