import { IAppConfig } from "@types";
import { createConnection, getConnectionOptions } from "typeorm";
import { UserController } from "@api/User/UserController";
import { ExampleRouter } from "@api/Example/ExampleRouter";

export const config: IAppConfig = {
  jwtSecret: "Rakkit",
  startOptions: {
  },
  ormConnection: async () => {
    // Get ormconfig.ts file content and create the connection to the database
    await createConnection(await getConnectionOptions());
  },
  controllers: [
    ExampleRouter,
    UserController
  ]
};
