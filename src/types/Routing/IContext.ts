import { IGqlContext } from "../..";
import { IRestContext } from "./IRestContext";

export interface IContext extends IRestContext, IGqlContext {
  apiType: "gql" | "rest";
}
