import { GraphQLFieldConfig } from "graphql";
import {
  IDeprecation,
  IPartial,
  IRequired,
  IQuery,
  IHasType
} from "../..";

export interface IField extends
  IHasType,
  IDeprecation,
  IPartial,
  IRequired,
  IQuery {
  description?: string;
  compiled?: GraphQLFieldConfig<any, any>;
}
