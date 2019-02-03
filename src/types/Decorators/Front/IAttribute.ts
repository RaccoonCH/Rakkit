import { FrontType } from "@types";

export interface IAttribute {
  name?: string;
  type?: FrontType;
  isEditable?: boolean;
  isInHeader?: boolean;
  isSearchable?: boolean;
  placeOrder?: number;
}
