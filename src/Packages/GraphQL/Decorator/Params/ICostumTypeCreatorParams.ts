import { GqlType, IGqlObjectParams } from "../..";

export interface ICustomTypeCreatorParams extends Partial<IGqlObjectParams> {
  name?: string;
  gqlType?: GqlType;
}
