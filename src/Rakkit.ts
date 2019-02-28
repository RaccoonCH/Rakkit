import "reflect-metadata";
import * as SocketIo from "socket.io";
import * as Router from "koa-router";
import * as Koa from "koa";
import { createServer, Server } from "http";
import { AppLoader, MetadataStorage } from "./logic";
import { IAppConfig, MiddlewareExecutionTime } from "./types";
import { Color } from "./misc";

export class Rakkit extends AppLoader {
  protected static _instance: Rakkit;
  private _koaApp: Koa;
  private _mainRestRouter: Router;
  private _mainRootRouter: Router;
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

  private constructor(config?: IAppConfig) {
    super();
    this._config = config || {};
    this._config = {
      globalRestMiddlewares: this._config.globalRestMiddlewares || [],
      globalRootMiddlewares: this._config.globalRootMiddlewares || [],
      host: this._config.host || "localhost",
      port: this._config.port || 4000,
      restEndpoint: this._config.restEndpoint === undefined ? "/rest" : config.restEndpoint,
      routers: this._config.routers || [],
      websockets: this._config.websockets || [],
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

  /**
   * Start the application (Express, GraphQL, ...)
   */
  static async start(config?: IAppConfig): Promise<Rakkit> {
    if (!this.Instance || config) {
      this._instance = new Rakkit(config);
    }

    this.Instance.LoadControllers(this.Instance._config);
    await MetadataStorage.Instance.BuildAll();

    this.Instance.startAllServices();
    return this.Instance;
  }

  static async stop() {
    if (this.Instance) {
      if (this.Instance._socketio) {
        await new Promise((resolve) => {
          this.Instance._socketio.close(resolve);
        });
      }
      await new Promise((resolve) => {
        this.Instance._httpServer.close(resolve);
      });
    }
    return this._instance;
  }

  private async startAllServices() {
    const startRest = Rakkit.Instance._config.routers && Rakkit.Instance._config.routers.length > 0;
    const startWs = Rakkit.Instance._config.websockets && Rakkit.Instance._config.websockets.length > 0;
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
      const routers = Array.from(MetadataStorage.Instance.Routers.values());
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
    Array.from(MetadataStorage.Instance.Websockets.values()).map((ws) => {
      const nsp = this._socketio.of(ws.params.namespace);
      nsp.on("connection", (socket) => {
        console.log(`Connected to room ${ws.params.namespace}`);
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
      this._koaApp.use(MetadataStorage.Instance.MainRouter.routes());
      resolve();
    });
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
