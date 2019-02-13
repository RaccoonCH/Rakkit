import "reflect-metadata";
import * as SocketIO from "socket.io";
import * as Path from "path";
import * as Koa from "koa";
import * as BodyParser from "koa-bodyparser";
import * as Cors from "@koa/cors";
import * as Static from "koa-static";
import * as Router from "koa-router";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { GraphQLSchema, subscribe, execute } from "graphql";
import { ApolloServer } from "apollo-server-koa";
import { createServer, Server } from "http";
import { buildSchema } from "rakkitql";
import { IMain, HandlerFunction, IContext } from "@types";
import { AppLoader, DecoratorStorage } from "@logic";
import { config } from "@app/RakkitConfig";
import { Color } from "@misc";

export class Main extends AppLoader {
  protected static _instance: Main;
  private _host: string;
  private _port: number;
  private _restEndpoint: string;
  private _graphqlEndpoint: string;
  private _koaApp: Koa;
  private _mainKoaRouter: Router;
  private _httpServer: Server;
  private _apolloServer?: ApolloServer;
  private _corsEnabled?: boolean;
  private _socketio: SocketIO.Server;
  private _publicPath: string;
  private _subscriptionServer: SubscriptionServer;

  static get Instance(): Main {
    return this._instance;
  }

  private constructor(params: IMain) {
    super();
    this._corsEnabled = params.corsEnabled || true;
    this._host = params.host || "localhost";
    this._port = params.port || 4000;
    this._restEndpoint = params.restEndpoint || "/rest";
    this._graphqlEndpoint = params.graphqlEndpoint || "/gql";
    this._publicPath = params.publicPath || Path.join(__dirname, "../public");
    this._koaApp = new Koa();
    this._httpServer = createServer(this._koaApp.callback());
  }

  /**
   * Start the application (Express, GraphQL, ...)
   */
  static async start(params?: IMain): Promise<Main> {
    if (!this.Instance) {
      this._instance = new Main(params || {});
    }
    if (config.ormConnection) {
      try {
        await config.ormConnection();
      } catch (err) {
        console.log(err);
      }
    }

    this.Instance.LoadControllers(config);
    await DecoratorStorage.Instance.BuildAll();

    this.Instance.startAllServices();
    return this.Instance;
  }

  /**
   * Restart REST and GraphQL service
   */
  async Restart() {
    return this.startAllServices();
  }

  private async startAllServices() {
    if (config.routers && config.routers.length > 0) {
      await this.startRest();
    }
    if (config.resolvers && config.resolvers.length > 0) {
      await this.startGraphQl();
    }
  }

  private loadMiddlewares(middlewares: ReadonlyMap<Object, HandlerFunction>) {
    AppLoader.loadMiddlewares(
      config.globalMiddlewares,
      this._mainKoaRouter,
      middlewares
    );
  }

  private async startWs() {
    this._socketio = SocketIO(this._httpServer);
    this._socketio.on("connection", (socket) => {
      DecoratorStorage.Instance.Ons.map((item) => {
        if (item.message !== "connection") {
          socket.on(item.message, (message: any) => {
            item.function(socket, message);
          });
        } else {
          item.function(socket);
        }
      });
    });
  }

  private async startRest() {
    return new Promise<void>(async (resolve) => {
      if (this._corsEnabled) {
        this._koaApp.use(Cors());
      }
      this._koaApp.use(BodyParser());

      // Server the public folder to be served as a static folder
      this._koaApp.use(Static(this._publicPath));

      this._mainKoaRouter = new Router({ prefix: this._restEndpoint });
      this._mainKoaRouter.use(DecoratorStorage.Instance.MainRouter.routes());

      this.loadMiddlewares(DecoratorStorage.Instance.BeforeMiddlewares);
      // Load the api returned router into the /[restEndpoint] route
      this._koaApp.use(this._mainKoaRouter.routes());
      this.loadMiddlewares(DecoratorStorage.Instance.AfterMiddlewares);

      await this.startWs();

      this._httpServer.listen(this._port, this._host, () => {
        console.log(Color(
          `REST:     Started on http://${this._host}:${this._port}${this._restEndpoint}`,
          "fg.black", "bg.green"
        ));
        resolve();
      });
    });
  }

  private async startGraphQl() {
    // Build TypeGraphQL schema to use it
    const schema: GraphQLSchema = await buildSchema({
      resolvers: config.resolvers,
      globalMiddlewares: config.globalMiddlewares
      // authChecker: ({ context }, roles) =>  {
      //   const user: GetableUser = context.req.user;
      //   if (user) {
      //     const authorizedRole: Array<string> = (roles.length <= 0 ? [ process.env.DefaultRequiredRole ] : roles);
      //     return authorizedRole.includes(user.Role);
      //   }
      //   return false;
      // }
    });
    this._apolloServer = new ApolloServer({
      schema,
      subscriptions: {
        path: this._graphqlEndpoint
      },
      context: ({ context }): IContext => {
        return {
          context,
          type: "gql"
        };
      }
    });
    this._apolloServer.applyMiddleware({
      app: this._koaApp,
      path: this._graphqlEndpoint
    });

    this._subscriptionServer = new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
      server: this._httpServer,
      path: this._graphqlEndpoint
    });

    console.log(Color(
      `GraphQL:  Started on http://${this._host}:${this._port}${this._apolloServer.graphqlPath}\n`,
      "fg.black", "bg.green"
    ));
  }
}

Main.start(config.startOptions);
