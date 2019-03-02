import { DiId, TypeFn } from "../..";

export interface IInject {
  paramIndex?: number;
  isArray?: boolean;
  ids: DiId[];
  injectionType: Function;
}
