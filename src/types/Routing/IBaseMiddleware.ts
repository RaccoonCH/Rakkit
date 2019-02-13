import { HandlerFunction } from "@types";

export interface IBaseMiddleware {
  use: HandlerFunction;
}
