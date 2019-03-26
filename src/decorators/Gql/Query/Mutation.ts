import { TypeFn, DecoratorHelper } from "../../..";

export function Mutation();
export function Mutation(type: TypeFn);
export function Mutation(name: string);
export function Mutation(type: TypeFn, name: string);
export function Mutation(typeOrName?: TypeFn | string, name?: string) {
  return DecoratorHelper.getAddResolveDecorator(typeOrName, name, "Mutation");
}
