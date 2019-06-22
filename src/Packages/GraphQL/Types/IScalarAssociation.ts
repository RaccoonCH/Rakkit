import { GraphQLScalarType } from "graphql";

export interface IScalarAssociation {
  type: Function;
  scalar: GraphQLScalarType;
}
