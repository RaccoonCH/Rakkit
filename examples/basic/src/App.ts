import { Rakkit } from "../../../src";

export class App {
  private _websockets = [`${__dirname}/websockets/*`];
  private _routers = [`${__dirname}/routers/*`];

  start() {
    Rakkit.start({
      websockets: this._websockets,
      routers: this._routers
    });
  }
}

const app = new App();
app.start();
