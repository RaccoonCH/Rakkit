import {
  BeforeMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@BeforeMiddleware()
export class GlobalSecondBeforeMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body += "gb2;";
    next();
  }
}
