import "reflect-metadata";
import { createServer, Server } from "http";
import * as SocketIo from "socket.io";
import * as Koa from "koa";
import { AppLoader, MetadataStorage } from "./logic";
import { IAppConfig, MiddlewareType, MiddlewareExecutionTime } from "./types";
import { Color } from "./misc";

export class Rakkit extends AppLoader {
  protected static _instance: Rakkit;
  private _koaApp: Koa;
  private _httpServer: Server;
  private _socketio: SocketIo.Server;
  private _config: IAppConfig;

  static get Instance() {
    return this._instance;
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

  private constructor(config?: IAppConfig) {
    super();
    this._config = config || {};
    this._config = {
      globalRestMiddlewares: this._config.globalRestMiddlewares || [],
      globalRootMiddlewares: this._config.globalRootMiddlewares || [],
      appMiddlewares: this._config.appMiddlewares || [],
      host: this._config.host || "localhost",
      port: this._config.port || 4000,
      restEndpoint: this._config.restEndpoint === undefined ? "/rest" : config.restEndpoint,
      routers: this._config.routers || [],
      websockets: this._config.websockets || [],
      resolvers: this._config.resolvers || [],
      silent: this._config.silent || false,
      socketioOptions: this._config.socketioOptions || {}
    };
    const socketioPath = this._config.socketioOptions.path;
    this._config.socketioOptions.path = socketioPath === undefined ? "/ws" : socketioPath;
    const restEndpoint = this._config.restEndpoint;
    this._config.restEndpoint = restEndpoint === "/" ? "" : restEndpoint;
    this._koaApp = new Koa();
    this._httpServer = createServer(this._koaApp.callback());
  }

  static async start(config?: IAppConfig) {
    if (!this._instance || config) {
      this._instance = new Rakkit(config);
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
    const rest = MetadataStorage.Instance.Rest;
    rest.LoadAnonymousMiddlewares(this._config.globalRestMiddlewares);
    rest.LoadAnonymousMiddlewares(this._config.globalRootMiddlewares);
    rest.LoadAnonymousMiddlewares(this._config.appMiddlewares);
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
    const startRest = Rakkit.Instance._config.routers.length + Rakkit.Instance._config.resolvers.length > 0;
    const startWs = Rakkit.Instance._config.websockets.length > 0;
    if (startRest || startWs) {
      this._httpServer.listen(this._config.port, this._config.host);
    }
    if (startRest) {
      await this.startRest();
      this.startMessage("REST  ", this._config.restEndpoint);
    }
    if (startWs) {
      await this.startWs();
      this.startMessage("WS    ", this._config.socketioOptions.path);
    }
    if (startRest && !this._config.silent) {
      const routers = Array.from(MetadataStorage.Instance.Rest.Routers.values());
      if (routers.length > 0) {
        console.log(
          Color("\nRouters:", "cmd.underscore")
        );
        routers.map((router) => {
          console.log(`✅  ${this.Url}${this._config.restEndpoint}${Color(router.params.path, "fg.blue", "cmd.dim")}`);
        });
      }
    }
  }

  private async startWs() {
    this._socketio = SocketIo(this._httpServer, this._config.socketioOptions);
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
      this.loadAppMiddlewares(this._config.appMiddlewares);
      this._koaApp.use(MetadataStorage.Instance.Rest.MainRouter.routes());
      this.loadAppMiddlewares(this._config.appMiddlewares, "AFTER");
      resolve();
    });
  }

  private loadAppMiddlewares(middlewares: MiddlewareType[], executionTime: MiddlewareExecutionTime = "BEFORE") {
    const rest = MetadataStorage.Instance.Rest;
    let allMiddlewares;
    switch (executionTime) {
      case "BEFORE":
        allMiddlewares = rest.BeforeMiddlewares;
        break;
      case "AFTER":
        allMiddlewares = rest.AfterMiddlewares;
        break;
    }
    Rakkit.loadMiddlewares(
      middlewares,
      this._koaApp,
      allMiddlewares
    );
  }

  private startMessage(type: string, suffix: string) {
    if (!this._config.silent) {
      console.log(Color(
        `${type}: ${this.Url}${suffix}`,
        "fg.black", "bg.green"
      ));
    }
  }
}
