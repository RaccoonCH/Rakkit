import {
  ICoreConfig,
  IGqlConfig,
  IRestConfig,
  IRoutingConfig,
  IWsConfig
} from "../..";

export interface IAppConfig extends ICoreConfig {
  gql?: Partial<IGqlConfig>;
  rest?: Partial<IRestConfig>;
  routing?: Partial<IRoutingConfig>;
  ws?: Partial<IWsConfig>;
}
