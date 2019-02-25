import "reflect-metadata";
import * as SocketIO from "socket.io";
import * as Path from "path";
import * as Koa from "koa";
import * as BodyParser from "koa-bodyparser";
import * as Cors from "@koa/cors";
import * as Static from "koa-static";
import * as Router from "koa-router";
import { createServer, Server } from "http";
import { HandlerFunction, IAppConfig } from "./types";
import { AppLoader, MetadataStorage } from "./logic";
import { Color } from "./misc";

export class Rakkit extends AppLoader {
  protected static _instance: Rakkit;
  private _corsEnabled?: boolean;
  private _host: string;
  private _port: number;
  private _restEndpoint: string;
  private _wsEndpoint: string;
  private _koaApp: Koa;
  private _mainKoaRouter: Router;
  private _httpServer: Server;
  private _socketio: SocketIO.Server;
  private _publicPath: string;
  private _config: IAppConfig;

  static get Instance() {
    return this._instance;
  }

  private constructor(config: IAppConfig) {
    super();
    this._config = config || {};
    this._corsEnabled = config.corsEnabled || true;
    this._host = config.host || "localhost";
    this._port = config.port || 4000;
    this._restEndpoint = config.restEndpoint || "/rest";
    this._wsEndpoint = config.wsEndpoint || "/ws";
    this._publicPath = config.publicPath || Path.join(__dirname, "../public");
    this._koaApp = new Koa();
    this._httpServer = createServer(this._koaApp.callback());
  }

  /**
   * Start the application (Express, GraphQL, ...)
   */
  static async start(config?: IAppConfig): Promise<Rakkit> {
    if (!this.Instance) {
      this._instance = new Rakkit(config);
    }

    this.Instance.LoadControllers(this.Instance._config);
    await MetadataStorage.Instance.BuildAll();

    this.Instance.startAllServices();
    return this.Instance;
  }

  static stop() {
    this.Instance._socketio.close();
    this.Instance._httpServer.close();
  }

  async Restart() {
    return this.startAllServices();
  }

  private async startAllServices() {
    const startRest = Rakkit.Instance._config.routers && Rakkit.Instance._config.routers.length > 0;
    const startWs = Rakkit.Instance._config.websockets && Rakkit.Instance._config.websockets.length > 0;
    if (startRest || startWs) {
      this._httpServer.listen(this._port, this._host);
    }
    if (startRest) {
      await this.startRest();
      this.startMessage("REST", this._restEndpoint);
    }
    if (startWs) {
      await this.startWs();
      this.startMessage("WS  ", this._wsEndpoint);
    }
    if (startRest) {
      Array.from(MetadataStorage.Instance.Routers.values()).map((router) => {
        console.log(`Router: ${router.params.path} ✅`);
      });
    }
  }

  private loadMiddlewares(middlewares: ReadonlyMap<Object, HandlerFunction>) {
    AppLoader.loadMiddlewares(
      this._config.globalMiddlewares,
      this._mainKoaRouter,
      middlewares
    );
  }

  private async startWs() {
    this._socketio = SocketIO(this._httpServer, {
      path: this._wsEndpoint
    });
    this._socketio.on("connection", (socket) => {
      MetadataStorage.Instance.Ons.map((item) => {
        if (item.params.message !== "connection") {
          socket.on(item.params.message, (message: any) => {
            item.params.function(socket, message);
          });
        } else {
          item.params.function(socket);
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
      this._mainKoaRouter.use(MetadataStorage.Instance.MainRouter.routes());

      this.loadMiddlewares(MetadataStorage.Instance.BeforeMiddlewares);
      // Load the api returned router into the /[restEndpoint] route
      this._koaApp.use(this._mainKoaRouter.routes());
      this.loadMiddlewares(MetadataStorage.Instance.AfterMiddlewares);

      resolve();
    });
  }

  private startMessage(type: string, suffix: string) {
    console.log(Color(
      `${type}: Started on http://${this._host}:${this._port}${suffix}`,
      "fg.black", "bg.green"
    ));
  }
}
