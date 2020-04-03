import "reflect-metadata";
import { ApolloServer } from "apollo-server-koa";
import * as BodyParser from "koa-bodyparser";
import * as path from "path";
import { MetadataStorage, Rakkit } from "rakkit";
import { RecipeResolver } from "src/simple-usage/recipe-resolver";
import { Serve } from "static-koa-router";

export class App {
  private _websockets = [`${__dirname}/websockets/*`];
  private _routers = [`${__dirname}/routers/*`];

  async start() {
    const app = await Rakkit.start({
      ws: {
        websockets: this._websockets,
      },
      rest: {
        routers: this._routers,
        globalRestMiddlewares: [BodyParser()],
      },
      gql: {
        resolvers: [RecipeResolver],
        // automatically create `schema.gql` file with schema definition in current folder
        emitSchemaFile: path.resolve(__dirname, "schema.gql"),
      },
    });

    Serve(`${__dirname}/public`, MetadataStorage.Instance.Rest.MainRouter);

    const schema = Rakkit.MetadataStorage.Gql.Schema;

    // Create GraphQL server
    const server = new ApolloServer({
      schema,
      // enable GraphQL Playground
      playground: true,
    });

    server.applyMiddleware({ app: app.KoaApp });
    // alternatively you can get a composed middleware from the apollo server
    // app.KoaApp.use(server.getMiddleware());
  }
}

const app = new App();
app.start();
