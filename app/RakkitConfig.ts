import { IAppConfig } from "@types";
import { createConnection, getConnectionOptions } from "typeorm";
import { Auth } from "@api/Example/Example.middleware";

export const config: IAppConfig = {
  jwtSecret: "Rakkit",
  startOptions: {
  },
  ormConnection: async () => {
    // Get ormconfig.ts file content and create the connection to the database
    await createConnection(await getConnectionOptions());
  },
  routers: [
    "**/*.router.ts"
  ],
  globalMiddlwares: [
    Auth
  ]
};
