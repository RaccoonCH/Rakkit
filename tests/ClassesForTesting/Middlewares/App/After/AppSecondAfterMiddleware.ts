import {
  AfterMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@AfterMiddleware()
export class AppSecondAfterMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body += "aa2;";
    await next();
  }
}
