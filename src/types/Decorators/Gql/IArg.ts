import { IHasType, INamed, IFlat } from "../..";

export interface IArg extends IHasType, INamed, IFlat {
  flat: boolean;
  index: number;
}
