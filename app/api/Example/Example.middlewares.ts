import { BeforeMiddleware } from "@decorators";
import { IContext } from "@types";

export class TestMiddlewares {
  @BeforeMiddleware()
  static check({ next }: IContext) {
    console.log("check");
    next();
  }
}
