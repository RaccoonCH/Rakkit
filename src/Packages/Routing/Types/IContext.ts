import {
  IGqlContext,
  IRestContext
} from "../../..";

export interface IContext<ResponseType = any> extends IRestContext {
  gql: IGqlContext<ResponseType>;
  apiType: "gql" | "rest";
}
