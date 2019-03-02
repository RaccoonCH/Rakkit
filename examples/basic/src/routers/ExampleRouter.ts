import { GoodbyeMiddleware } from "../middlewares/GoodbyeMiddleware";
import { HelloMiddleware } from "../middlewares/HelloMiddleware";
import { ExampleService } from "../services/ExampleService";
import {
  Router,
  Get,
  Inject,
  Context,
  NextFunction,
  UseMiddleware,
  Post
} from "../../../../src";

@Router("example")
@UseMiddleware(HelloMiddleware)
export class ExampleRouter {
  @Inject()
  private _routerService: ExampleService;

  @Get("/")
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
  get(context: Context, next: NextFunction) {
    console.log(this._routerService);
    context.body = "Hello world";
    next();
  }

  @Post("/")
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
  post(context: Context, next: NextFunction) {
    console.log(this._routerService);
    console.log(context.request.body);
    context.body = "Hello world";
    next();
  }

  @Get("/s")
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
  async asyncJob(context: Context, next: NextFunction) {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    context.body = "And voilà !";
  }
}
