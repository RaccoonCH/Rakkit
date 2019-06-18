import "reflect-metadata";
import { createServer, Server } from "http";
import * as SocketIo from "socket.io";
import * as Koa from "koa";
import { AppLoader } from "./AppLoader";
import {
  IAppConfig,
  MiddlewareType,
  MiddlewareExecutionTime,
  Color,
  MetadataStorage
} from "../../..";

export class Rakkit extends AppLoader {
  protected static _instance: Rakkit;
  private _koaApp: Koa;
  private _httpServer: Server;
  private _socketio: SocketIo.Server;
  private _config: IAppConfig;

  static get Instance() {
    return this._instance;
  }

  static get MetadataStorage() {
    return MetadataStorage.Instance;
  }

  get Config() {
    return this._config as Readonly<IAppConfig>;
  }

  get Url() {
    return `http://${this._config.host}:${this._config.port}`;
  }

  get SocketIo() {
    return this._socketio;
  }

  get KoaApp() {
    return this._koaApp;
  }

  get HttpServer() {
    return this._httpServer;
  }

  private constructor(config?: IAppConfig) {
    super();
    this._config = config || {};
    // TODO?: Function to do it
    this._config = {
      rest: {
        endpoint: "/rest",
        globalAppMiddlewares: [],
        globalRestMiddlewares: [],
        globalRootMiddlewares: [],
        routers: [],
        ...(this._config.rest || {})
      },
      ws: {
        options: {
          path: "/ws"
        },
        websockets: [],
        ...(this._config.ws || {})
      },
      gql: {
        globalMiddlewares: [],
        resolvers: [],
        dateMode: "iso",
        scalarMap: [],
        ...(this._config.gql || {})
      },
      routing: {
        globalMiddlewares: [],
        ...(this._config.routing || {})
      },
      forceStart: this._config.forceStart || [],
      host: this._config.host || "localhost",
      port: this._config.port || 4000,
      silent: this._config.silent || false
    };
    const restEndpoint = this._config.rest.endpoint;
    this._config.rest.endpoint = restEndpoint === "/" ? "" : restEndpoint;
    this._koaApp = new Koa();
    this._httpServer = createServer(this._koaApp.callback());
  }

  static async start(config?: IAppConfig) {
    if (!this._instance || config) {
      const configObj: Partial<IAppConfig> = {
        ...(this.Instance ? this.Instance.Config : {}),
        ...config
      };
      this._instance = new Rakkit(configObj);
    }
    return this._instance.start();
  }

  static async stop() {
    if (this._instance) {
      return this._instance.stop();
    }
  }

  private async start() {
    this.LoadControllers(this._config);
    const routing = MetadataStorage.Instance.Routing;
    const allMiddlewares = [
      ...this._config.rest.globalAppMiddlewares,
      ...this._config.rest.globalRootMiddlewares,
      ...this._config.rest.globalRestMiddlewares,
      ...this._config.gql.globalMiddlewares,
      ...this._config.routing.globalMiddlewares
    ];
    routing.LoadAnonymousMiddlewares(allMiddlewares);
    await MetadataStorage.Instance.BuildAll();
    this.startAllServices();
    return this;
  }

  private async stop() {
    if (this._socketio) {
      await new Promise((resolve) => {
        this._socketio.close(resolve);
      });
    }
    await new Promise((resolve) => {
      this._httpServer.close(resolve);
    });
    return this;
  }

  private async startAllServices() {
    const startGql = this._config.gql.resolvers.length > 0 || this._config.forceStart.includes("gql");
    const startRest = this._config.rest.routers.length > 0 || this._config.forceStart.includes("rest");
    const startWs = this._config.ws.websockets.length > 0 || this._config.forceStart.includes("ws");

    if (startRest || startWs || startGql || this._config.forceStart.includes("http")) {
      this._httpServer.listen(this._config.port, this._config.host);
      this.startMessage("HTTP", "/");
    }
    if (startRest) {
      await this.startRest();
      this.startMessage("REST", this._config.rest.endpoint);
    }
    if (startWs) {
      await this.startWs();
      this.startMessage("WS", this._config.ws.options.path);
    }
    if (startGql) {
      this.startMessage("GraphQL", "Started at the URL that you specified to your GraphQL server provider", true);
    }
    if (startRest && !this._config.silent) {
      const routers = Array.from(MetadataStorage.Instance.Rest.Routers.values());
      if (routers.length > 0) {
        console.log(
          Color("\nRouters:", "cmd.underscore")
        );
        routers.map((router) => {
          const routerUrl = this.Url + this._config.rest.endpoint + Color(router.params.path, "fg.blue", "cmd.dim");
          console.log(routerUrl);
          router.params.endpoints.map((endpoint) => {
            const endpointParams = endpoint.params;
            console.log(
              `\t${endpointParams.method.toUpperCase()}:`.padEnd(8),
              `${routerUrl}${Color(endpointParams.endpoint, "fg.green", "cmd.dim")}`
            );
          });
        });
      }
    }
  }

  private async startWs() {
    this._socketio = SocketIo(this._httpServer, this._config.ws.options);
    Array.from(MetadataStorage.Instance.Ws.Websockets.values()).map((ws) => {
      const nsp = this._socketio.of(ws.params.namespace);
      nsp.on("connection", (socket) => {
        ws.params.ons.map(({ params }) => {
          if (params.event !== "connection") {
            socket.on(params.event, (datas: any) => {
              params.function(socket, datas);
            });
          } else {
            params.function(socket);
          }
        });
      });
    });
  }

  private async startRest() {
    return new Promise<void>(async (resolve) => {
      this.loadAppMiddlewares(this._config.routing.globalMiddlewares);
      this.loadAppMiddlewares(this._config.rest.globalAppMiddlewares);
      this._koaApp.use(MetadataStorage.Instance.Rest.MainRouter.routes());
      this.loadAppMiddlewares(this._config.rest.globalAppMiddlewares, "AFTER");
      this.loadAppMiddlewares(this._config.routing.globalMiddlewares, "AFTER");
      resolve();
    });
  }

  private loadAppMiddlewares(middlewares: MiddlewareType[], executionTime: MiddlewareExecutionTime = "BEFORE") {
    const routing = MetadataStorage.Instance.Routing;
    let allMiddlewares;
    switch (executionTime) {
      case "BEFORE":
        allMiddlewares = routing.BeforeMiddlewares;
        break;
      case "AFTER":
        allMiddlewares = routing.AfterMiddlewares;
        break;
    }
    routing.LoadMiddlewares(
      middlewares,
      this._koaApp,
      allMiddlewares
    );
  }

  private startMessage(
    type: string,
    suffix: string,
    noUrl: boolean = false
  ) {
    if (!this._config.silent) {
      console.log(Color(
        `${type.padEnd(7)}: ${noUrl ? "" : this.Url}${suffix}`,
        "fg.black", "bg.green"
      ));
    }
  }
}
