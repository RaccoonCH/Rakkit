import "reflect-metadata";
import * as SocketIO from "socket.io";
import * as Path from "path";
import * as Koa from "koa";
import * as BodyParser from "koa-bodyparser";
import * as Cors from "@koa/cors";
import * as Static from "koa-static";
import * as Router from "koa-router";
import { createServer, Server } from "http";
import { HandlerFunction, IContext, IAppConfig } from "./types";
import { AppLoader, MetadataStorage } from "./logic";
import { Color } from "./misc";

export class Rakkit extends AppLoader {
  protected static _instance: Rakkit;
  private _host: string;
  private _port: number;
  private _restEndpoint: string;
  private _koaApp: Koa;
  private _mainKoaRouter: Router;
  private _httpServer: Server;
  private _corsEnabled?: boolean;
  private _socketio: SocketIO.Server;
  private _publicPath: string;
  private _config: IAppConfig;

  static get Instance() {
    return this._instance;
  }

  private constructor(config: IAppConfig) {
    super();
    this._config = config || {};
    const params = this._config.startOptions || {};
    this._corsEnabled = params.corsEnabled || true;
    this._host = params.host || "localhost";
    this._port = params.port || 4000;
    this._restEndpoint = params.restEndpoint || "/rest";
    this._publicPath = params.publicPath || Path.join(__dirname, "../public");
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

  async Restart() {
    return this.startAllServices();
  }

  private async startAllServices() {
    if (Rakkit.Instance._config.routers && Rakkit.Instance._config.routers.length > 0) {
      await this.startRest();
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
    this._socketio = SocketIO(this._httpServer);
    this._socketio.on("connection", (socket) => {
      MetadataStorage.Instance.Ons.map((item) => {
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
      this._mainKoaRouter.use(MetadataStorage.Instance.MainRouter.routes());

      this.loadMiddlewares(MetadataStorage.Instance.BeforeMiddlewares);
      // Load the api returned router into the /[restEndpoint] route
      this._koaApp.use(this._mainKoaRouter.routes());
      this.loadMiddlewares(MetadataStorage.Instance.AfterMiddlewares);

      await this.startWs();

      this._httpServer.listen(this._port, this._host, () => {
        console.log(Color(
          `REST:     Started on http://${this._host}:${this._port}${this._restEndpoint}`,
          "fg.black", "bg.green"
        ));
        Array.from(MetadataStorage.Instance.Routers.values()).map((router) => {
          console.log(`✅ ${router.params.path}`);
        });
        resolve();
      });
    });
  }
}
