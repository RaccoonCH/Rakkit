import { Rakkit, MetadataStorage } from "../../../src";
import { ApolloServer } from "apollo-server";

export class App {
  private _resolvers = [`${__dirname}/resolvers/*`];

  async start() {
    await Rakkit.start({
      resolvers: this._resolvers
    });
    const server = new ApolloServer({
      schema: MetadataStorage.Instance.Gql.Schema,
      context: (context, next) => ({
        context, next
      })
    });
    const { url } = await server.listen(4002);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  }
}

const app = new App();
app.start();
