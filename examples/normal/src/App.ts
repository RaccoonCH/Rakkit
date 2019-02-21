import { Rakkit } from "../../../src";

export class App {
  private routers = [`${__dirname}/api/**/*Router.ts`];

  start() {
    Rakkit.start({
      routers: this.routers
    });
  }
}

const app = new App();
app.start();
