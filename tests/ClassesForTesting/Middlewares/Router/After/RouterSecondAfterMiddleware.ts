import {
  AfterMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@AfterMiddleware()
export class RouterSecondAfterMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body += "ra2;";
    next();
  }
}
