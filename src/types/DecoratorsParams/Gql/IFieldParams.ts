import {
  INullable,
  IDeprecation,
  IPartial,
  IRequired
} from "../..";

export interface IFieldParams extends
  Partial<INullable>,
  Partial<IDeprecation>,
  Partial<IRequired>,
  Partial<IPartial> {}
