import {
  BeforeMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@BeforeMiddleware()
export class RouterSecondBeforeMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body += "rb2;";
    await next();
  }
}
