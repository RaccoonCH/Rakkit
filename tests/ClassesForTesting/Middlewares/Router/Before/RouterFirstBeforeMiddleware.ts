import { TestService } from "../../../TestService";
import {
  BeforeMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction,
  Inject
} from "../../../../../src";

@BeforeMiddleware()
export class RouterFirstBeforeMiddleware implements IBaseMiddleware {
  @Inject()
  private _testService: TestService;

  async use(context: IContext, next: NextFunction) {
    this._testService.TestValue.firstBeforeRouter = true;
    context.body += "rb1;";
    await next();
  }
}
