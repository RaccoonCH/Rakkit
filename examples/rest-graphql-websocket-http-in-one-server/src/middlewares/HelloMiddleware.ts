import {
  IBaseMiddleware,
  IContext,
  NextFunction,
  BeforeMiddleware,
  Inject,
} from "rakkit";
import { ExampleService } from "src/services/ExampleService";

@BeforeMiddleware()
export class HelloMiddleware implements IBaseMiddleware {
  @Inject()
  private _exampleService: ExampleService;

  async use(context: IContext, next: NextFunction) {
    context;
    this._exampleService.MyServiceValue = "I've passed to HelloMiddleware :)";
    console.log("Hello");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await next();
  }
}
