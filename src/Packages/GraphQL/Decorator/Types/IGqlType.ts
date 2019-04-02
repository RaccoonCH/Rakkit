import { GraphQLObjectType, GraphQLEnumValueConfigMap } from "graphql";
import {
  GqlType,
  INamed,
  IInterface,
  IDecorator
} from "../../../..";

export interface IGqlType<Type extends GqlType = any> extends INamed, IInterface {
  gqlType: Type;
  enumValues?: GraphQLEnumValueConfigMap;
  unionTypes?: Function[];
  compiled?: InstanceType<Type>;
}
