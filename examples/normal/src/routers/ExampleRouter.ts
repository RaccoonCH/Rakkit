import { ExampleService } from "../services/ExampleService";
import {
  Router,
  Get,
  Inject,
  IContext,
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
  @UseMiddleware(GoodbyeMiddleware)
  get({ context }: IContext, next: NextFunction) {
    console.log(this._routerService);
    context.body = "Hello world";
    next();
  }
}
