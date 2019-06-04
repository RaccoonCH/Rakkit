import {
  TypeFn,
  GqlType
} from "../../../..";

export interface IHasType {
  arrayDepth?: number;
  nullable?: boolean;
  type: TypeFn;
  gqlType?: GqlType;
}
