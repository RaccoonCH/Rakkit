import { TestService } from "../../../TestService";
import {
  BeforeMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction,
  Inject
} from "../../../../../../..";

@BeforeMiddleware()
export class GlobalFirstBeforeMiddleware implements IBaseMiddleware {
  @Inject()
  private _testService: TestService;

  async use(context: IContext, next: NextFunction) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!context.request.body) {
      throw new Error("BodyParser error");
    }
    if (!this) {
      throw new Error("IContext not binded");
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
