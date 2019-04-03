import { Rakkit, MetadataStorage } from "../../../src";
import { ApolloServer } from "apollo-server-koa";

export class App {
  private _resolvers = [`${__dirname}/resolvers/*`];

  async start() {
    await Rakkit.start({
      gql: {
        resolvers: this._resolvers
      }
    });
    const server = new ApolloServer({
      schema: MetadataStorage.Instance.Gql.Schema,
      context: ({ctx}) => ({
        ...ctx
      })
    });
    server.applyMiddleware({
      app: Rakkit.Instance.KoaApp
    });
  }
}

const app = new App();
app.start();
