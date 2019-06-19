import {
  TypeFn,
  GqlType
} from "../../../..";

export interface IHasType {
  arrayDepth?: number;
  arrayNullable?: boolean[];
  nullable?: boolean;
  type: TypeFn;
  gqlType?: GqlType;
  noType?: boolean;
}
