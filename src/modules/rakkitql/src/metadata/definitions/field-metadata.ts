import { TypeValueThunk, TypeOptions } from "../../decorators/types";
import { MiddlewareType } from "../../../../../types";
import { ParamMetadata } from "./param-metadata";
import { Complexity } from "../../interfaces";
import { BaseClassMetadata } from "./types";

export interface FieldMetadata extends BaseClassMetadata {
  schemaName: string;
  getType: TypeValueThunk;
  typeOptions: TypeOptions;
  description: string | undefined;
  deprecationReason: string | undefined;
  complexity: Complexity | undefined;
  getter: boolean;
  setter: boolean;
  isAccessor: boolean;
  destinationField?: boolean;
  params?: ParamMetadata[];
  roles?: any[];
  fieldResolver?: boolean;
  fields?: FieldMetadata[];
  middlewares?: MiddlewareType[];
}
