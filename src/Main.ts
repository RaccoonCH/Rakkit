import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import * as BodyParser from "body-parser";
import * as Express from "express";
import * as jwt from "express-jwt";
import * as Path from "path";
import * as Cors from "cors";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { GraphQLSchema, subscribe, execute } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { createServer, Server } from "http";
import { IMain, IType, BaseMiddleware } from "@types";
import { AppLoader, DecoratorStorage } from "@logic";
import { config } from "@app/RakkitConfig";
import { Color } from "@misc";
import { GetableUser } from "@api/User/Types/GetableUser";

export class Main extends AppLoader {

  static get Instance(): Main {
    return this._instance;
  }
  protected static _instance: Main;
  private _host: string;
  private _port: number;
  private _restEndpoint: string;
  private _graphqlEndpoint: string;
  private _expressApp: Express.Express;
  private _publicPath: string;
  private _subscriptionServer: SubscriptionServer;
  private _httpServer: Server;
  private _apolloServer?: ApolloServer;
  private _corsEnabled?: boolean;

  private constructor(params: IMain) {
    super(params.apiPath || Path.join(__dirname, "..", "app", "api"));
    this._corsEnabled = params.corsEnabled || true;
    this._host = params.host || "localhost";
    this._port = params.port || 4000;
    this._restEndpoint = params.restEndpoint || "/rest";
    this._graphqlEndpoint = params.graphqlEndpoint || "/gql";
    this._publicPath = params.publicPath || Path.join(__dirname, "../public");
    this._expressApp = Express();
    this._httpServer = createServer(this._expressApp);
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

  private loadMiddlewares(middlewares: IType<BaseMiddleware>[]) {
    if (middlewares) {
      middlewares.map((Item) => {
        const instance = new Item();
        this._expressApp.use(instance.use);
      });
    }
  }

  private async startAllServices() {
    if (config.routers && config.routers.length > 0) {
      await this.startRest();
    }
    if (config.resolvers && config.resolvers.length > 0) {
      await this.startGraphQl();
    }
  }

  private async startRest() {
    return new Promise<void>((resolve) => {
      // Load the application (all RakkitPackage)
      // this.Load();

      if (DecoratorStorage.Instance.Packages) {
        this.ExpressRouter.use("/", (req, res) => {
          res.send(DecoratorStorage.Instance.Packages);
        });
      }

      if (this._corsEnabled) {
        this._expressApp.use(Cors());
      }
      this._expressApp.use(BodyParser.urlencoded({extended: false}));
      this._expressApp.use(BodyParser.json());

      // Server the public folder to be served as a static folder
      this._expressApp.use("/", Express.static(this._publicPath));

      this.loadMiddlewares(config.globalMiddlwares);
      // Load the api returned router into the /[restEndpoint] route
      this._expressApp.use(this._restEndpoint, DecoratorStorage.Instance.MainRouter);
      this.loadMiddlewares(config.globalMiddlwares);

      // Use jwt auth middleware
      this._expressApp.use(jwt({
        secret: config.jwtSecret,
        credentialsRequired: false
      }));

      // Invalid token error response
      this._expressApp.use((
        err: Express.ErrorRequestHandler,
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
      ) => {
        if (err.name === "UnauthorizedError") {
          res.status(401).send("unauthorized");
        } else {
          next();
        }
      });

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
    const schema: GraphQLSchema = await TypeGraphQL.buildSchema({
      resolvers: config.resolvers,
      authChecker: ({ context }, roles) =>  {
        const user: GetableUser = context.req.user;
        if (user) {
          const authorizedRole: Array<string> = (roles.length <= 0 ? [ process.env.DefaultRequiredRole ] : roles);
          return authorizedRole.includes(user.Role);
        }
        return false;
      }
    });
    this._apolloServer = new ApolloServer({
      schema,
      subscriptions: {
        path: this._graphqlEndpoint
      },
      context: ({ req }) => {
        return {
          req,
          user: req.user // from express-jwt
        };
      }
    });
    this._apolloServer.applyMiddleware({
      app: this._expressApp,
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
