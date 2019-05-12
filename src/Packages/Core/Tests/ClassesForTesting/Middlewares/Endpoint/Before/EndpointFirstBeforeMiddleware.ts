import { TestService } from "../../../TestService";
import {
  BeforeMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction,
  Inject
} from "../../../../../../..";

@BeforeMiddleware()
export class EndpointFirstBeforeMiddleware implements IBaseMiddleware {
  @Inject()
  private _testService: TestService;

  async use(context: IContext, next: NextFunction) {
    this._testService.TestValue.firstBeforeEndpoint = true;
    context.body += "eb1;";
    await next();
  }
}
