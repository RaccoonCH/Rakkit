import { GraphQLFieldConfig } from "graphql";
import {
  IDeprecation,
  IPartial,
  IRequired,
  IQuery,
  IHasType,
  INamed
} from "../..";

export interface IField extends
  IHasType,
  IDeprecation,
  IPartial,
  IRequired,
  IQuery,
  INamed {
  description?: string;
  compiled?: GraphQLFieldConfig<any, any>;
}
