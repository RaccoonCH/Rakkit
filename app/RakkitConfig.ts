import { createConnection, getConnectionOptions } from "typeorm";
import { IAppConfig } from "@types";
import { Auth } from "@api/Example/Example.middleware";
import { Stat } from "@api/Example/Example.finisher";
import { TestMiddlewares } from "@api/Example/test.middlewares";

export const config: IAppConfig = {
  jwtSecret: "Rakkit",
  startOptions: {
  },
  ormConnection: async () => {
    // Get ormconfig.ts file content and create the connection to the database
    await createConnection({
      name: "default",
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "rakkit",
      synchronize: false,
      entities: [
        `${__dirname}/*/*Model.ts`
      ]
    });
  },
  routers: [
    "**/*.router.ts"
  ],
  websockets: [
    "**/*.ws.ts"
  ],
  globalMiddlewares: [
    TestMiddlewares.check
  ]
};
