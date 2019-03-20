import {
  GraphQLInputType,
  GraphQLInputObjectType,
  GraphQLObjectType
} from "graphql";
import {
  GqlType,
  INamed,
  IInterface
} from "../..";

export interface IGqlType extends INamed, IInterface {
  gqlTypeName: GqlType;
  compiled?: GraphQLInputType | GraphQLInputObjectType | GraphQLObjectType | {};
}
