import * as BodyParser from "koa-bodyparser";
import { Rakkit, IAppConfig } from "../../src";

const getDirName = (path) => {
  return `${__dirname}/../ClassesForTesting/${path}`;
};

export const Start = async (config?: IAppConfig) => {
  const wsGlob = getDirName("*Ws.ts");
  const routerGlob = getDirName("*Router.ts");
  return Rakkit.start({
    port: 3000,
    websockets: [wsGlob],
    routers: [routerGlob],
    globalRestMiddlewares: [
      BodyParser()
    ],
    silent: false, // False for codecov
    ...(config || {})
  });
};
