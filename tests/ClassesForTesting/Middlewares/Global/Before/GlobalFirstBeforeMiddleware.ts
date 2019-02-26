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
    this._testService.TestValue.firstBeforeGlobal = true;
    context.body = "gb1;";
    next();
  }
}
