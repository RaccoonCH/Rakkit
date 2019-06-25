import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as path from "path";
import { Rakkit } from "../../../src";

import RecipeResolver from "./recipe.resolver";

async function bootstrap() {
  await Rakkit.start({
    gql: {
      resolvers: [RecipeResolver],
      emitSchemaFile: path.resolve(__dirname, "schema.gql")
    }
  });
  const schema = Rakkit.MetadataStorage.Gql.Schema;

  const server = new ApolloServer({
    schema,
    playground: true
  });

  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap().catch(console.error);
