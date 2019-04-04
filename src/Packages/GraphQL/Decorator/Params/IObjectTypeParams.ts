import {
  IGqlTypeParams,
  IInterface
} from "../..";

export interface IObjectTypeParams extends
IGqlTypeParams,
Partial<IInterface> {
  description?: string;
  deprecationReason?: string;
}
