import { GraphQLResolveInfo } from "graphql";
import { ArgsDictionary } from "../../modules/rakkitql";

export interface IGraphQLContext {
  root: any;
  args: ArgsDictionary;
  info: GraphQLResolveInfo;
}
