import {
  IRestConfig,
  IGqlConfig,
  IWsConfig,
  IRoutingConfig
} from "../../..";

export interface IAppConfig {
  silent?: boolean;
  host?: string;
  port?: number;
  forceStart?: ("rest" | "gql" | "http" | "ws")[];
  rest?: Partial<IRestConfig>;
  ws?: Partial<IWsConfig>;
  gql?: Partial<IGqlConfig>;
  routing?: Partial<IRoutingConfig>;
}
