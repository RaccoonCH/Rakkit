import {
  GraphQLInputType,
  GraphQLInputObjectType,
  GraphQLObjectType
} from "graphql";
import {
  GqlType,
  IGeneric
} from "../..";

export interface IGqlType extends IGeneric {
  gqlTypeName: GqlType;
  compiled?: GraphQLInputType | GraphQLInputObjectType | GraphQLObjectType | {};
  interfaces?: Function[];
}
