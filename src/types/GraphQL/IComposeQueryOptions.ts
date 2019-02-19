import { GetArgs, IRelationQuery } from "..";

export interface IComposeQueryOptions extends GetArgs<any> {
  readonly relations?: (string | IRelationQuery)[];
}
