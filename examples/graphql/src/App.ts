import { ApolloServer } from "apollo-server-koa";
import { Rakkit, MetadataStorage, GQLISODateTime } from "../../../src";
import { ScalarMapTest } from "./objects/ExampleObjectType";
import { HelloMiddleware } from "../../basic/src/middlewares/HelloMiddleware";
import { GoodbyeMiddleware } from "../../basic/src/middlewares/GoodbyeMiddleware";

export class App {
  private _resolvers = [`${__dirname}/resolvers/*`];

  async start() {
    await Rakkit.start({
      gql: {
        resolvers: this._resolvers,
        scalarsMap: [
          { type: ScalarMapTest, scalar: GQLISODateTime }
        ],
        exportSchemaFileTo: `${__dirname}/schema.gql`,
        globalMiddlewares: [
          HelloMiddleware,
          GoodbyeMiddleware
        ]
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
