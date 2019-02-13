import { BeforeMiddleware } from "@decorators";
import { IBaseMiddleware, IContext, NextFunction } from "@types";

@BeforeMiddleware()
export class Before implements IBaseMiddleware {
  async use(ctx: IContext, next: NextFunction) {
    console.log("Before");
    next();
  }
}
