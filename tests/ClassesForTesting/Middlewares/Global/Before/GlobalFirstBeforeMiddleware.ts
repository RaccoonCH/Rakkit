import { TestService } from "../../../TestService";
import {
  BeforeMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction,
  Inject
} from "../../../../../src";

@BeforeMiddleware()
export class GlobalFirstBeforeMiddleware implements IBaseMiddleware {
  @Inject()
  private _testService: TestService;

  async use(context: Context, next: NextFunction) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!context.request.body) {
      throw new Error("BodyParser error");
    }
    if (!this) {
      throw new Error("Context not binded");
    }
    this._testService.TestValue.firstBeforeGlobal = true;
    if (context.body) {
      context.body += "gb1;";
    } else {
      context.body = "gb1;";
    }
    await next();
  }
}
