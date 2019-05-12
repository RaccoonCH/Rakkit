import {
  BeforeMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction
} from "../../../../../../..";

@BeforeMiddleware()
export class RouterSecondBeforeMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    context.body += "rb2;";
    await next();
  }
}
