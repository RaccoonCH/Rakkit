import { IRestConfig } from "..";

declare global {
  interface IAppConfig {
    rest?: Partial<IRestConfig>;
  }
}
