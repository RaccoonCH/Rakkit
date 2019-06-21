import {
  IGqlContext,
  IRestContext
} from "../../..";

export interface IContext<ResponseType = any> extends IRestContext<ResponseType> {
  gql: IGqlContext<ResponseType>;
  apiType: "gql" | "rest";
}
