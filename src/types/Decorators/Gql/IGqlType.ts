import {
  GraphQLInputType,
  GraphQLInputObjectType,
  GraphQLObjectType
} from "graphql";
import {
  GqlType,
  INamed
} from "../..";

export interface IGqlType extends INamed {
  gqlTypeName: GqlType;
  compiled?: GraphQLInputType | GraphQLInputObjectType | GraphQLObjectType | {};
  interfaces?: Function[];
}
