import { Options } from "@koa/cors";

export type CorsOptions = Partial<Options> & {
  disabled?: boolean
};
