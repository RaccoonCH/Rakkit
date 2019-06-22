import {
  GqlType,
  IGqlObject
} from "../..";

export interface IFieldParams extends Partial<IGqlObject> {
  nullable?: boolean;
  gqlType?: GqlType;
  defaultValue?: any;
  arrayNullable?: boolean[];
}
