import {
  INullable,
  INamed,
  IFlat
} from "../..";

export interface IArgParams extends
Partial<INullable>,
Partial<INamed>,
Partial<IFlat> {
}
