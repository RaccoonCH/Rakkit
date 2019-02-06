import { GetArgs, IRelationQuery } from "@types";

export interface IComposeQueryOptions extends GetArgs<any> {
  readonly relations?: (string | IRelationQuery)[];
}
