import { GqlType } from "../..";

export interface ICustomTypeCreatorParams {
  gqlType?: GqlType;
  description?: string;
  deprecationReason?: string;
  name?: string;
}
