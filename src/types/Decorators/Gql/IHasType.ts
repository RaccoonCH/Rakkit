import {
  INullable,
  IIsArray,
  TypeFn
} from "../..";

export interface IHasType extends
  INullable,
  IIsArray {
  type: TypeFn;
}
