import { Rakkit, MetadataStorage } from "../../../src";
import * as BodyParser from "koa-bodyparser";
import { Serve } from "static-koa-router";

export class App {
  private _websockets = [`${__dirname}/websockets/*`];
  private _routers = [`${__dirname}/routers/*`];

  async start() {
    await Rakkit.start({
      websockets: this._websockets,
      routers: this._routers,
      globalRestMiddlewares: [
        BodyParser()
      ]
    });

    Serve(
      `${__dirname}/public`,
      MetadataStorage.Instance.Rest.MainRouter
    );
  }
}

const app = new App();
app.start();
