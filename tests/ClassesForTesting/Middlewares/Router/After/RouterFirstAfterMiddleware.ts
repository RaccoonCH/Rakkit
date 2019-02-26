import {
  AfterMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@AfterMiddleware()
export class RouterFirstAfterMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body += "ra1;";
    next();
  }
}
