import { IGqlContext } from "../..";
import { IRestContext } from "./IRestContext";

export interface IContext<ResponseType = any> extends
  IRestContext,
  IGqlContext<ResponseType> {
  apiType: "gql" | "rest";
}
