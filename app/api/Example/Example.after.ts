import { AfterMiddleware } from "@decorators";
import { IBaseMiddleware, IContext, NextFunction } from "@types";

@AfterMiddleware()
export class After implements IBaseMiddleware {
  async use(ctx: IContext, next: NextFunction) {
    console.log("After");
  }
}
