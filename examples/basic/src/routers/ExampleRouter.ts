import { ExampleService } from "../services/ExampleService";
import {
  Router,
  Get,
  Inject,
  Context,
  NextFunction,
  UseMiddleware
} from "../../../../src";
import { HelloMiddleware } from "../middlewares/HelloMiddleware";
import { GoodbyeMiddleware } from "../middlewares/GoodbyeMiddleware";

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

  @Get("/")
  @UseMiddleware(GoodbyeMiddleware, HelloMiddleware)
  get2(context: Context, next: NextFunction) {
    console.log(this._routerService);
    context.body = "Hello world";
    next();
  }
}
