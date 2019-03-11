import {
  AfterMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@AfterMiddleware()
export class AppFirstAfterMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body += "aa1;";
    await next();
  }
}
