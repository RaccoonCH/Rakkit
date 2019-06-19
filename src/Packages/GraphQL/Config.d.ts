import { IGqlConfig } from "..";

declare global {
  interface IAppConfig {
    gql?: Partial<IGqlConfig>;
  }
}
