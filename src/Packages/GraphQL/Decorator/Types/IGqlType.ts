import { GraphQLEnumValueConfigMap } from "graphql";
import {
  GqlType,
  INamed,
  IInterface,
  ITypeTransformation
} from "../../../..";

export interface IGqlType<Type extends GqlType = any> extends INamed, IInterface {
  gqlType?: Type;
  extends?: Function;
  enumValues?: GraphQLEnumValueConfigMap;
  unionTypes?: Function[];
  transformation?: ITypeTransformation<Type>;
  compiled?: InstanceType<Type>;
}
