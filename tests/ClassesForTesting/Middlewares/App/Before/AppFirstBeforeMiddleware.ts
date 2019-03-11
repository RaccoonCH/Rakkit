import {
  BeforeMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@BeforeMiddleware()
export class AppFirstBeforeMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body = "ab1;";
    await next();
  }
}
