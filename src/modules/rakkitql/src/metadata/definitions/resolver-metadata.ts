import {
  TypeValueThunk,
  TypeOptions,
  ClassTypeResolver,
  SubscriptionFilterFunc,
  SubscriptionTopicFunc,
} from "../../decorators/types";
import { MiddlewareType } from "../../../../../types";
import { ParamMetadata } from "./param-metadata";
import { Complexity } from "../../interfaces";

export interface BaseResolverMetadata {
  methodName: string;
  schemaName: string;
  target: Function;
  complexity: Complexity | undefined;
  resolverClassMetadata?: ResolverClassMetadata;
  params?: ParamMetadata[];
  roles?: any[];
  middlewares?: MiddlewareType[];
}

export interface ResolverMetadata extends BaseResolverMetadata {
  getReturnType: TypeValueThunk;
  returnTypeOptions: TypeOptions;
  description?: string;
  deprecationReason?: string;
}

export interface FieldResolverMetadata extends BaseResolverMetadata {
  kind: "internal" | "external";
  description?: string;
  deprecationReason?: string;
  getType?: TypeValueThunk;
  typeOptions?: TypeOptions;
  getObjectType?: ClassTypeResolver;
}

export interface SubscriptionResolverMetadata extends ResolverMetadata {
  topics: string | string[] | SubscriptionTopicFunc;
  filter: SubscriptionFilterFunc | undefined;
}

export interface ResolverClassMetadata {
  target: Function;
  getObjectType: ClassTypeResolver;
  isAbstract?: boolean;
  superResolver?: ResolverClassMetadata;
}
