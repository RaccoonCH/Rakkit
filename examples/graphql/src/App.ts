import { SubscriptionServer } from "subscriptions-transport-ws";
import { ApolloServer } from "apollo-server-koa";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { Rakkit, MetadataStorage } from "../../../src";

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

    server.installSubscriptionHandlers(Rakkit.Instance.HttpServer);
  }
}

const app = new App();
app.start();
