import {
  AfterMiddleware,
  IBaseMiddleware,
  Context,
  NextFunction
} from "../../../../../src";

@AfterMiddleware()
export class EndpointSecondAfterMiddleware implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    context.body += "ea2;";
    await next();
  }
}
