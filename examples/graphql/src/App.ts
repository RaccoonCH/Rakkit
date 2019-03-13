import { Rakkit} from "../../../src";

export class App {
  private _resolvers = [`${__dirname}/resolvers/*`];

  async start() {
    await Rakkit.start({
      resolvers: this._resolvers
    });
  }
}

const app = new App();
app.start();
