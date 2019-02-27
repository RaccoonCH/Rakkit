import { Rakkit } from "../../../src";
import { join as Join } from "path";

export class App {
  private _websockets = [`${__dirname}/websockets/*`];
  private _routers = [`${__dirname}/routers/*`];

  start() {
    Rakkit.start({
      websockets: this._websockets,
      routers: this._routers,
      public: {
        path: Join(__dirname, "public")
      }
    });
  }
}

const app = new App();
app.start();
