import { IMain } from "@types";

export interface IAppConfig {
  jwtSecret?: string;
  startOptions?: IMain;
  controllers?: Function[];
  ormConnection?: Function;
}
