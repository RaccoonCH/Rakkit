import { Options } from "koa-static";

export type PublicOptions = Partial<Options> & {
  endpoint?: string,
  path?: string,
  disabled?: boolean;
};
