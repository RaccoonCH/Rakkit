import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as path from "path";
import { Rakkit } from "../../../src";

import { RecipeResolver } from "./recipe-resolver";

async function bootstrap() {
  // build Rakkit executable schema
  await Rakkit.start({
    gql: {
      resolvers: [RecipeResolver],
      // automatically create `schema.gql` file with schema definition in current folder
      emitSchemaFile: path.resolve(__dirname, "schema.gql")
    }
  });
  const schema = Rakkit.MetadataStorage.Gql.Schema;

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    // enable GraphQL Playground
    playground: true
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
