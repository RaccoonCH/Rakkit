import {
  INullable,
  IDeprecation,
  IPartial,
  IRequired,
  IQuery
} from "../..";
import { GraphQLFieldConfig } from 'graphql';

export interface IField extends INullable, IDeprecation, IPartial, IRequired, IQuery {
  type: Function;
  isArray?: boolean;
  description?: string;
  compiled?: GraphQLFieldConfig<any, any>;
}
