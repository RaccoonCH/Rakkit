import { createConnection } from "typeorm";
import { IAppConfig } from "@types";

const basePath = `${__dirname}/api/`;

export const config: IAppConfig = {
  jwtSecret: "Rakkit",
  startOptions: {
  },
  ormConnection: async () => {
    return createConnection({
      name: "default",
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "rakkit",
      synchronize: false,
      entities: [
        `${basePath}**/*.model.ts`
      ]
    });
  },
  resolvers: [
    `${basePath}**/*.resolver.ts`
  ],
  routers: [
    `${basePath}**/*.router.ts`
  ],
  websockets: [
    `${basePath}**/*.ws.ts`
  ],
  globalMiddlewares: [
  ]
};
