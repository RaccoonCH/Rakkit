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
    if (!context.request.body) {
      throw new Error("BodyParser error");
    }
    this._testService.TestValue.firstBeforeGlobal = true;
    context.body = "gb1;";
    next();
  }
}
