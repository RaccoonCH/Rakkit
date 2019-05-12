import {
  BeforeMiddleware,
  IBaseMiddleware,
  IContext,
  NextFunction
} from "../../../../../../..";

@BeforeMiddleware()
export class EndpointSecondBeforeMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    context.body += "eb2;";
    await next();
  }
}
