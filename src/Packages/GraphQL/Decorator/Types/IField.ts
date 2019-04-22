import { GraphQLFieldConfig } from "graphql";
import {
  IDeprecation,
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
  subscriptionTopics?: string[];
  enumValue?: any;
  compiled?: GraphQLFieldConfig<any, any>;
}
