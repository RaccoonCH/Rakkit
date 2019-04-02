import {
  IGqlContext,
  IRestContext
} from "../../..";

export interface IContext<ResponseType = any> extends
  IRestContext,
  IGqlContext<ResponseType> {
  apiType: "gql" | "rest";
}
