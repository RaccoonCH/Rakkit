import {
  GqlType,
  INamed,
  IInterface
} from "../..";

export interface IGqlType<Type extends GqlType = any> extends INamed, IInterface {
  gqlType: Type;
  compiled?: InstanceType<Type>;
}
