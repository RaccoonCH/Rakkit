import { GraphQLResolveInfo } from "graphql";
import { KeyValue } from "../../..";

export interface IGqlContext<ResponseType> {
  args: KeyValue;
  rawArgs: KeyValue;
  info: GraphQLResolveInfo;
  root: any;
  gqlResponse: ResponseType;
}
