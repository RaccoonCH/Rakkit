import { DiId } from "../..";

export interface IInject {
  ids: DiId[];
  isArray: boolean;
  injectionType: Function;
}
