import {
  BeforeMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction
} from "../../../../../src";

@BeforeMiddleware()
export class AppSecondBeforeMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    context.body += "ab2;";
    await next();
  }
}
