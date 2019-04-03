import {
  IRestConfig,
  IGqlConfig,
  IWsConfig,
  IRoutingConfig
} from "..";

export interface IAppConfig {
  silent?: boolean;
  host?: string;
  port?: number;
  rest?: Partial<IRestConfig>;
  ws?: Partial<IWsConfig>;
  gql?: Partial<IGqlConfig>;
  routing?: Partial<IRoutingConfig>;
}
