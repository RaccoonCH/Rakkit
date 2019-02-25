import { Rakkit, IAppConfig } from "../../src";

const getDirName = (path) => {
  return `${__dirname}/${path}`;
};

export const Start = async (config?: IAppConfig) => {
  const wsGlob = getDirName("*Ws.ts");
  return Rakkit.start({
    ...(config || {}),
    port: 3000,
    websockets: [wsGlob]
  });
};
