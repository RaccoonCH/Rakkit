import { GraphQLFieldConfig } from "graphql";
import {
  IDeprecation,
  IPartial,
  IRequired,
  IQuery,
  IHasType,
  INamed,
  IDescription
} from "../..";

export interface IField extends
  IHasType,
  IDeprecation,
  IQuery,
  INamed,
  Partial<IDescription> {
  compiled?: GraphQLFieldConfig<any, any>;
}
