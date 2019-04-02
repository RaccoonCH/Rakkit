import {
  IArg,
  GqlResolveType
} from "../..";

export interface IQuery {
  resolveType: GqlResolveType;
  function: Function;
  args: IArg[];
}
