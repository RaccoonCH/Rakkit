import {
  IBaseMiddleware,
  IContext,
  AfterMiddleware,
  NextFunction,
} from "rakkit";

@AfterMiddleware()
export class GoodbyeMiddleware implements IBaseMiddleware {
  async use(context: IContext, next: NextFunction) {
    console.log("Goodbye");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await next();
  }
}
