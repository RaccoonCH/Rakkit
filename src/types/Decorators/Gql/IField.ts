import {
  INullable,
  IDeprecation,
  IPartial,
  IRequired,
  IQuery
} from "../..";

export interface IField extends INullable, IDeprecation, IPartial, IRequired, IQuery {
  type: Function;
  isArray?: boolean;
  description?: string;
}
