import { MiddlewareType } from "@types";

export interface MiddlewareMetadata {
  target: Function;
  fieldName: string;
  middlewares: MiddlewareType[];
}
