import {
  TypeFn,
  GqlType
} from "../../../..";

export interface IHasType {
  isArray?: boolean;
  nullable?: boolean;
  type: TypeFn;
  gqlType?: GqlType;
}
