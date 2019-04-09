import {
  INullable,
  IIsArray,
  TypeFn,
  GqlType
} from "../../../..";

export interface IHasType extends
INullable,
IIsArray {
  type: TypeFn;
  gqlType?: GqlType;
}
