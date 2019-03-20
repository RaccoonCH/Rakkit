import { DecoratorHelper } from "../../../logic";

export function ObjectType();
export function ObjectType(name: string);
export function ObjectType(interfaces: Function[]);
export function ObjectType(name: string, ...interfaces: Function[]);
export function ObjectType(nameOrInterfaces?: string | Function[], ...interfaces: Function[]): Function {
  const isName = typeof nameOrInterfaces === "string";
  const definedName: string = isName ? nameOrInterfaces as string : undefined;
  const definedInterfaces: Function[] = isName ? interfaces : nameOrInterfaces as Function[];
  return (target: Function): void => {
    DecoratorHelper.getAddTypeFunction(target, "ObjectType", definedName, definedInterfaces);
  };
}
