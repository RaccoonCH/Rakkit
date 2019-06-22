import { GraphQLEnumValueConfigMap } from "graphql";
import {
  GqlType,
  ITypeTransformation,
  IGqlObject,
  IResolveType
} from "../../../..";

export interface IGqlType<Type extends GqlType = any> extends IGqlObject, IResolveType {
  implements?: Function[];
  gqlType?: Type;
  extends?: Function;
  enumValues?: GraphQLEnumValueConfigMap;
  unionTypes?: Function[];
  transformation?: ITypeTransformation<Type>;
  compiled?: InstanceType<Type>;
  isAbstract?: boolean;
  ofType?: Function;
}
