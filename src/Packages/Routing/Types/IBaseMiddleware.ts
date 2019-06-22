import { HandlerFunction } from "..";

export interface IBaseMiddleware {
  use: HandlerFunction;
}
