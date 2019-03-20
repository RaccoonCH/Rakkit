import {
  INullable,
  IDeprecation,
  IPartial
} from "../..";

export interface IField extends INullable, IDeprecation, IPartial {
  type: Function;
  isArray?: boolean;
  description?: string;
}
