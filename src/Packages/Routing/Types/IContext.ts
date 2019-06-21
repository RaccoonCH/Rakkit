import {
  IGqlContext,
  IRestContext
} from "../../..";

export interface IContext<ResponseType = any> extends Partial<IRestContext<ResponseType>> {
  gql: Partial<IGqlContext<ResponseType>>;
  apiType: "gql" | "rest";
}
