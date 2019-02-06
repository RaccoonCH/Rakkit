import { BaseMiddleware, IContext } from "@types";
import { AfterMiddleware } from "@decorators";

@AfterMiddleware()
export class Stat extends BaseMiddleware {
  use ({ next }: IContext) {
    console.log("Stat");
    next();
  }
}
