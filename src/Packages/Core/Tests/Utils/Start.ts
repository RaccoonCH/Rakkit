import * as BodyParser from "koa-bodyparser";
import { Rakkit, IAppConfig } from "../../../..";

const getDirName = (path) => {
  return `${__dirname}/../ClassesForTesting/${path}`;
};

export const Start = async (config?: IAppConfig) => {
  const wsGlob = getDirName("*Ws.ts");
  const routerGlob = getDirName("*Router.ts");
  const routers = [routerGlob];
  const definedConfig = config || {};
  return Rakkit.start({
    silent: true, // False for codecov
    port: 3000,
    ...(definedConfig.rest || {}),
    ws: {
      websockets: [wsGlob],
      options: {
        path: "/ws2"
      },
      ...(definedConfig.rest || {})
    },
    rest: {
      routers,
      globalRootMiddlewares: [
        BodyParser()
      ],
      ...(definedConfig.rest || {})
    }
  });
};
