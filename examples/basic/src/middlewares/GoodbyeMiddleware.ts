import {
  IBaseMiddleware,
  Context,
  AfterMiddleware,
  NextFunction
} from "../../../../src";

@AfterMiddleware()
export class GoodbyeMiddleware implements IBaseMiddleware {
  async use (context: Context, next: NextFunction) {
    console.log("Goodbye");
    next();
  }
}
