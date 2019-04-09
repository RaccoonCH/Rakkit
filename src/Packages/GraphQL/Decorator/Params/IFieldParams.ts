import {
  INullable,
  IDeprecation,
  IDescription,
  INamed,
  GqlType
} from "../..";

export interface IFieldParams extends
Partial<INullable>,
Partial<INamed>,
IDescription,
IDeprecation {
  gqlType?: GqlType;
}
