import {
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType
} from "graphql";

export type GqlType =
  typeof GraphQLObjectType |
  typeof GraphQLInputObjectType |
  typeof GraphQLEnumType |
  typeof GraphQLUnionType |
  typeof GraphQLInterfaceType;
