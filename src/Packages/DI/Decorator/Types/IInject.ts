import {
  DiId
} from "../..";

export interface IInject {
  paramIndex?: number;
  isArray?: boolean;
  ids: DiId[];
  injectionType: Function;
}
