import {
  AfterMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction
} from "../../../../../../..";

@AfterMiddleware()
export class GlobalFirstAfterMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    context.body += "ga1;";
    await next();
  }
}
