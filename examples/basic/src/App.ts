import { Rakkit } from "../../../src";
import * as BodyParser from "koa-bodyparser";

export class App {
  private _websockets = [`${__dirname}/websockets/*`];
  private _routers = [`${__dirname}/routers/*`];

  start() {
    Rakkit.start({
      websockets: this._websockets,
      routers: this._routers,
      globalRestMiddlewares: [
        BodyParser()
      ]
    });
  }
}

const app = new App();
app.start();
