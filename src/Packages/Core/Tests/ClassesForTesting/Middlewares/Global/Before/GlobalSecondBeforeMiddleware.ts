import {
  BeforeMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction
} from "../../../../../../..";

@BeforeMiddleware()
export class GlobalSecondBeforeMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    context.body += "gb2;";
    await next();
  }
}
