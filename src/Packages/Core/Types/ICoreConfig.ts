export interface ICoreConfig {
  silent?: boolean;
  host?: string;
  port?: number;
  forceStart?: ("rest" | "gql" | "http" | "ws")[];
}
