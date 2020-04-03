import { GoodbyeMiddleware } from "src/middlewares/GoodbyeMiddleware";
import { HelloMiddleware } from "src/middlewares/HelloMiddleware";
import { ExampleService } from "src/services/ExampleService";
import {
  Router,
  Get,
  Inject,
  IContext,
  NextFunction,
  UseMiddleware,
  Post,
} from "rakkit";

@Router("example")
@UseMiddleware(HelloMiddleware)
export class ExampleRouter {
  @Inject()
  private _routerService: ExampleService;

  @Get("/")
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
  async get(context: IContext, next: NextFunction) {
    console.log(this._routerService);
    context.body = "Hello world";
    await next();
  }

  @Post("/")
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
  async post(context: IContext, next: NextFunction) {
    console.log(this._routerService);
    /* unfortunately context.request in typescript does not know about body */
    console.log({ body: (context.request as any).body });
    context.body = "Hello world";
    await next();
  }

  @Get("/async")
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
  async asyncJob(context: IContext, next: NextFunction) {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    context.body = "And voilà !";
    await next();
  }
}
