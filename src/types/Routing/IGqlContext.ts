import { GraphQLResolveInfo } from "graphql";
import { KeyValue } from "../..";

export interface IGqlContext {
  args: KeyValue[];
  rawArgs: KeyValue;
  info: GraphQLResolveInfo;
  root: any;
}
