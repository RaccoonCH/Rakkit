import {
  INullable,
  IDeprecation,
  IPartial,
  IRequired,
  INamed
} from "../..";

export interface IFieldParams extends
  Partial<INullable>,
  Partial<IDeprecation>,
  Partial<IRequired>,
  Partial<IPartial>,
  Partial<INamed> {}
