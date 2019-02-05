import { BaseMiddleware } from "@types";
import { BeforeMiddleware } from "@decorators";

@BeforeMiddleware()
export class Auth extends BaseMiddleware {
  use(req, res, next) {
    console.log("mid");
    next();
  }
}
