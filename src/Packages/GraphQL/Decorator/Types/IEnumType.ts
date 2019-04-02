import { GraphQLEnumValueConfigMap } from "graphql";
import { INamed } from "../..";

export interface IEnumType extends INamed {
  values: GraphQLEnumValueConfigMap;
}
