import { GraphQLResolveInfo } from "graphql";
import { ArgsDictionary } from "rakkitql";

export interface IGraphQLContext {
  root: any;
  args: ArgsDictionary;
  info: GraphQLResolveInfo;
}
