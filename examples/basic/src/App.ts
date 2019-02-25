import { Rakkit } from "../../../src";

export class App {
  private _websockets = [`${__dirname}/websockets/*`];

  start() {
    Rakkit.start({
      websockets: this._websockets
    });
  }
}

const app = new App();
app.start();
