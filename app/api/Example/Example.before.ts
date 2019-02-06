import { BaseMiddleware, IContext } from "@types";
import { BeforeMiddleware } from "@decorators";

@BeforeMiddleware()
export class Auth extends BaseMiddleware {
  use({ next }: IContext) {
    console.log("mid");
    next();
  }
}
