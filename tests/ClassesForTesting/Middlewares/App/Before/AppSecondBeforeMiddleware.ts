import {
  BeforeMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@BeforeMiddleware()
export class AppSecondBeforeMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body += "ab2;";
    await next();
  }
}
