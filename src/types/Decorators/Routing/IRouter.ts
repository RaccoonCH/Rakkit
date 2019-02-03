import { IEndpoint } from "./IEndpoint";

export interface IRouter {
  path: string;
  extends?: Function;
  endpoints?: IEndpoint[];
}
