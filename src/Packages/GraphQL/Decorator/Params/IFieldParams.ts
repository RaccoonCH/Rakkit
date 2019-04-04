import {
  INullable,
  IDeprecation,
  IDescription,
  INamed
} from "../..";

export interface IFieldParams extends
Partial<INullable>,
Partial<INamed>,
IDescription,
IDeprecation {
}
