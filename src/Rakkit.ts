import "reflect-metadata";
import * as BodyParser from "koa-bodyparser";
import * as SocketIo from "socket.io";
import * as Static from "koa-static";
import * as Router from "koa-router";
import * as Cors from "@koa/cors";
import * as Koa from "koa";
import { createServer, Server } from "http";
import { AppLoader, MetadataStorage } from "./logic";
import { IAppConfig, CorsOptions, PublicOptions, WsOptions } from "./types";
import { Color } from "./misc";

export class Rakkit extends AppLoader {
  protected static _instance: Rakkit;
  private _cors: CorsOptions;
  private _public: PublicOptions;
  private _host: string;
  private _port: number;
  private _restEndpoint: string;
  private _socketioOptions: WsOptions;
  private _koaApp: Koa;
  private _mainRestRouter: Router;
  private _httpServer: Server;
  private _socketio: SocketIo.Server;
  private _silent: boolean;
  private _config: IAppConfig;

  static get Instance() {
    return this._instance;
  }

  get Config() {
    return this._config as Readonly<IAppConfig>;
  }

  get Url() {
    return `http://${this._host}:${this._port}`;
  }

  get SocketIo() {
    return this._socketio;
  }

  private constructor(config?: IAppConfig) {
    super();
    this._config = config || {};
    this._cors = this._config.cors || { disabled: false };
    this._public = this._config.public || { disabled: true };
    this._public.endpoint = this._public.endpoint || "";
    this._host = this._config.host || "localhost";
    this._port = this._config.port || 4000;
    this._restEndpoint = this._config.restEndpoint || "/rest";
    this._socketioOptions = this._config.SocketioOptions || {};
    this._socketioOptions.path = this._socketioOptions.path || "/ws";
    this._silent = this._config.silent || false;
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
      this._httpServer.listen(this._port, this._host);
    }
    if (startRest) {
      await this.startRest();
      if (!this._public.disabled) {
        this.startMessage("PUBLIC", this._public.endpoint);
      }
      this.startMessage("REST  ", this._restEndpoint);
    }
    if (startWs) {
      await this.startWs();
      this.startMessage("WS    ", this._socketioOptions.path);
    }
    if (startRest && !this._silent) {
      const routers = Array.from(MetadataStorage.Instance.Routers.values());
      if (routers.length > 0) {
        console.log(
          Color("\nRouters:", "cmd.underscore")
        );
        routers.map((router) => {
          console.log(`✅  ${this.Url}${this._restEndpoint}${Color(router.params.path, "fg.blue", "cmd.dim")}`);
        });
      }
    }
  }

  private async startWs() {
    this._socketio = SocketIo(this._httpServer, this._socketioOptions);
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
      if (!this._cors.disabled) {
        this._koaApp.use(
          Cors(this._cors)
        );
      }
      this._koaApp.use(BodyParser());
      this._mainRestRouter = new Router({ prefix: this._restEndpoint });
      this._mainRestRouter.use(MetadataStorage.Instance.MainRouter.routes());
      this._koaApp.use(this._mainRestRouter.routes());

      if (!this._public.disabled) {
        const publicRouter = new Router({
          prefix: "/"
        });
        publicRouter.all("*", Static(this._public.path));
        this._koaApp.use(publicRouter.routes());
      }
      resolve();
    });
  }

  private startMessage(type: string, suffix: string) {
    if (!this._silent) {
      console.log(Color(
        `${type}: ${this.Url}${suffix}`,
        "fg.black", "bg.green"
      ));
    }
  }
}
