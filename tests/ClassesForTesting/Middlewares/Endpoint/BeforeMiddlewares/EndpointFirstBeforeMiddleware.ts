import { TestService } from "../../../TestService";
import {
  BeforeMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction,
  Inject
} from "../../../../../src";

@BeforeMiddleware()
export class EndpointFirstBeforeMiddleware implements IBaseMiddleware {
  @Inject()
  private _testService: TestService;

  async use(context: Context, next: NextFunction) {
    this._testService.TestValue.firstBeforeEndpoint = true;
    context.body += "eb1;";
    next();
  }
}
