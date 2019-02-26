import { Rakkit, IAppConfig } from "../../src";

const getDirName = (path) => {
  return `${__dirname}/../ClassesForTesting/${path}`;
};

export const Start = async (config?: IAppConfig) => {
  const wsGlob = getDirName("*Ws.ts");
  const routerGlob = getDirName("*Router.ts");
  return Rakkit.start({
    ...(config || {}),
    port: 3000,
    websockets: [wsGlob],
    routers: [routerGlob],
    silent: true
  });
};
