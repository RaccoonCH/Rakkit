import { FrontType } from "../..";

export interface IAttribute {
  name?: string;
  type?: FrontType;
  isEditable?: boolean;
  isInHeader?: boolean;
  isSearchable?: boolean;
  placeOrder?: number;
}
