import {
  BeforeMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@BeforeMiddleware()
export class EndpointSecondBeforeMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body += "eb2;";
    next();
  }
}
