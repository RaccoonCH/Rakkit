import { GraphQLObjectType } from "graphql";
import { DecoratorHelper } from "../../../Helpers/DecoratorHelper";
import {
  MetadataStorage
} from "../../../../..";

export function ObjectType();
export function ObjectType(name: string);
export function ObjectType(interfaces: Function[]);
export function ObjectType(name: string, ...interfaces: Function[]);
export function ObjectType(nameOrInterfaces?: string | Function[], ...interfaces: Function[]): Function {
  const isName = typeof nameOrInterfaces === "string";
  const definedName: string = isName ? nameOrInterfaces as string : undefined;
  const definedInterfaces: Function[] = isName ? interfaces : nameOrInterfaces as Function[];
  return (target: Function): void => {
    MetadataStorage.Instance.Gql.AddType(
      DecoratorHelper.getAddTypeParams(target, GraphQLObjectType, definedName, definedInterfaces)
    );
  };
}
