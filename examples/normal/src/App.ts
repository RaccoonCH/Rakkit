import { Rakkit } from "../../../src";

export class App {
  private _routers = [`${__dirname}/routers/*`];
  private _websockets = [`${__dirname}/websockets/*`];

  start() {
    Rakkit.start({
      routers: this._routers,
      websockets: this._websockets
    });
  }
}

const app = new App();
app.start();
