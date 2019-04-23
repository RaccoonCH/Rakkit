import { GraphQLEnumValueConfigMap } from "graphql";
import {
  GqlType,
  ITypeTransformation,
  IGqlObject
} from "../../../..";

export interface IGqlType<Type extends GqlType = any> extends IGqlObject {
  implements?: Function[];
  gqlType?: Type;
  extends?: Function;
  enumValues?: GraphQLEnumValueConfigMap;
  unionTypes?: Function[];
  transformation?: ITypeTransformation<Type>;
  compiled?: InstanceType<Type>;
}
