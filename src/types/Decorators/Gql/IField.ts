import {
  INullable,
  IDeprecation,
  IGeneric
} from "../..";

export interface IField extends INullable, IDeprecation, IGeneric {
  type: Function;
  isArray?: boolean;
  description?: string;
}
