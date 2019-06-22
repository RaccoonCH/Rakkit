import {
  AfterMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction
} from "../../../../../../..";

@AfterMiddleware()
export class AppFirstAfterMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    context.body += "aa1;";
    await next();
  }
}
