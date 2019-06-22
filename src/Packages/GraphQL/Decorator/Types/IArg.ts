import {
  IHasType
} from "../..";

export interface IArg extends IHasType {
  name: string;
  flat: boolean;
  index: number;
  defaultValue?: any;
  description?: string;
}
