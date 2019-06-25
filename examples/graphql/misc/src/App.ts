import { ApolloServer } from "apollo-server-koa";
import { Rakkit, MetadataStorage, GQLISODateTime, Router, Get, IContext, NextFunction } from "../../../../src";
import { ScalarMapTest } from "./objects/ExampleTypes";
import { HelloMiddleware } from "../../../basic/src/middlewares/HelloMiddleware";
import { GoodbyeMiddleware } from "../../../basic/src/middlewares/GoodbyeMiddleware";

@Router("yo")
class Test {
  @Get("/test")
  async yo(context: IContext<string>, next: NextFunction) {
    context.body = "hello";
    console.log("ok");
    await next();
  }
}

export class App {
  private _resolvers = [`${__dirname}/resolvers/*`];

  async start() {
    await Rakkit.start({
      rest: {
        routers: [
          Test
        ],
        globalAppMiddlewares: [
          HelloMiddleware,
          GoodbyeMiddleware
        ]
      },
      gql: {
        resolvers: this._resolvers,
        inArrayNullableByDefault: true,
        scalarsMap: [
          { type: ScalarMapTest, scalar: GQLISODateTime }
        ],
        emitSchemaFile: `${__dirname}/schema.gql`,
        globalMiddlewares: [
          HelloMiddleware,
          GoodbyeMiddleware
        ],
        globalMiddlewaresExclude: ["FieldResolver", "Field"]
      },
      routing: {
        globalMiddlewares: [
          async (ctx, next) => {
            console.log("yo");
            await next();
          },
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
