import { IGqlConfig } from "..";

declare global {
  interface IAppConfig {
    silent?: boolean;
    host?: string;
    port?: number;
    forceStart?: ("rest" | "gql" | "http" | "ws")[];
  }
}
