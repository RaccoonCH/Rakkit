import {
  IBaseMiddleware,
  IContext,
  NextFunction,
  BeforeMiddleware
} from "../../../../src";

@BeforeMiddleware()
export class HelloMiddleware implements IBaseMiddleware {
  async use (context: IContext, next: NextFunction) {
    console.log("Hello");
    next();
  }
}
