import { BaseMiddleware } from "@types";
import { AfterMiddleware } from "@decorators";

@AfterMiddleware()
export class Stat extends BaseMiddleware {
  use(req, res, next) {
    console.log("Stat");
  }
}
