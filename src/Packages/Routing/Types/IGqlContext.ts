import { GraphQLResolveInfo } from "graphql";
import { KeyValue, GqlResolveType } from "../../..";

export interface IGqlContext<ResponseType> {
  args: KeyValue;
  rawArgs: KeyValue;
  info: GraphQLResolveInfo;
  root: any;
  response: ResponseType;
  queryType: GqlResolveType;
}
