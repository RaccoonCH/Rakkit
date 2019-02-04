import { BaseMiddleware } from "@types";
import { Middleware } from "@decorators";

@Middleware()
export class Auth extends BaseMiddleware {
  use(req, res, next) {
    console.log("mid");
  }
}
