import { IWsConfig } from "..";

declare global {
  interface IAppConfig {
    ws?: Partial<IWsConfig>;
  }
}
