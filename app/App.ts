import { Rakkit } from "../src";

export class App {
  start() {
    Rakkit.start({
      routers: [`${__dirname}/*.router.ts`]
    });
  }
}

console.log(`${__dirname}`);

const app = new App();
app.start();
