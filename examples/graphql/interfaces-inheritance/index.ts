import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Rakkit } from "../../../src";

import { MultiResolver } from "./resolver";

async function bootstrap() {
  await Rakkit.start({
    gql: {
      resolvers: [MultiResolver]
    }
  });
  const schema = Rakkit.MetadataStorage.Gql.Schema;

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
