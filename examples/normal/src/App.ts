import { Rakkit } from "../../../src";

export class App {
  private routers = [`${__dirname}/routers/*`];

  start() {
    Rakkit.start({
      routers: this.routers
    });
  }
}

const app = new App();
app.start();
