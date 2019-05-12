import {
  BeforeMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction
} from "../../../../../../..";

@BeforeMiddleware()
export class AppFirstBeforeMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    context.body = "ab1;";
    await next();
  }
}
