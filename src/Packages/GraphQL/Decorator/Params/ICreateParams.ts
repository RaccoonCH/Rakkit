import {
  INamed,
  IDescription
} from "../..";

export interface ICreateParams extends
  Partial<INamed>,
  Partial<IDescription> {}
