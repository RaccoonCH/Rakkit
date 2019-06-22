import { GraphQLFieldConfig } from "graphql";
import {
  IHasType,
  GqlResolveType,
  IArg,
  Topic,
  ISubscriptionFnParams
} from "../../..";

export interface IField extends IHasType {
  name: string;
  compiled?: GraphQLFieldConfig<any, any>;
  topics?: Topic;
  resolveType?: GqlResolveType;
  deprecationReason?: string;
  description?: string;
  function?: Function;
  enumValue?: any;
  args?: IArg[];
  defaultValue?: any;
  subscribe?: (params: ISubscriptionFnParams) => AsyncIterator<any>;
  filter?: (params: ISubscriptionFnParams) => boolean | Promise<boolean>;
}
