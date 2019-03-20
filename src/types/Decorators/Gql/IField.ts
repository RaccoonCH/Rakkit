import {
  INullable,
  IDeprecation,
  IPartial,
  IRequired
} from "../..";

export interface IField extends INullable, IDeprecation, IPartial, IRequired {
  type: Function;
  isArray?: boolean;
  description?: string;
}
