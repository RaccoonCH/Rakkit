import {
  AfterMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction
} from "../../../../../../..";

@AfterMiddleware()
export class GlobalSecondAfterMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    context.body += "ga2;";
    await next();
  }
}
