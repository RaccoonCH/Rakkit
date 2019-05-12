import {
  AfterMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction
} from "../../../../../../..";

@AfterMiddleware()
export class RouterFirstAfterMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    context.body += "ra1;";
    await next();
  }
}
