import { BeforeMiddleware } from "@decorators";

export class TestMiddlewares {
  @BeforeMiddleware()
  static check(req, res, next) {
    console.log("check");
    next();
  }
}
