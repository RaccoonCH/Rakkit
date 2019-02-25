import {
  IBaseMiddleware,
  IContext,
  NextFunction,
  BeforeMiddleware,
  Inject
} from "../../../../src";
import { ExampleService } from "../services/ExampleService";

@BeforeMiddleware()
export class HelloMiddleware implements IBaseMiddleware {
  @Inject()
  private _exampleService: ExampleService;

  async use (context: IContext, next: NextFunction) {
    this._exampleService.MyServiceValue = "I've passed to HelloMiddleware :)";
    console.log("Hello");
    next();
  }
}
