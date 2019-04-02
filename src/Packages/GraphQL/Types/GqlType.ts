import {
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLScalarType
} from "graphql";
import {
  GraphQLRequiredType,
  GraphQLPartialType
} from "..";

export type GqlType =
  typeof GraphQLObjectType |
  typeof GraphQLInputObjectType |
  typeof GraphQLEnumType |
  typeof GraphQLUnionType |
  typeof GraphQLInterfaceType |
  typeof GraphQLRequiredType |
  typeof GraphQLPartialType |
  typeof GraphQLScalarType;
