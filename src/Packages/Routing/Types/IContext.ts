import {
  IGqlContext,
  IRestContext
} from "../../..";

export interface IContext<ResponseType = any, RootType = any> extends Partial<IRestContext<ResponseType>> {
  gql: Partial<IGqlContext<ResponseType, RootType>>;
  apiType: "gql" | "rest";
}
