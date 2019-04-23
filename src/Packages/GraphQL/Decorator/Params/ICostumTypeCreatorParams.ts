import { GqlType, IGqlObject } from "../..";

export interface ICustomTypeCreatorParams extends Partial<IGqlObject> {
  gqlType?: GqlType;
}
