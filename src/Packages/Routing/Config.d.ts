import { IRoutingConfig } from "..";

declare global {
  interface IAppConfig {
    routing?: Partial<IRoutingConfig>;
  }
}
