import { Router, Get} from "@decorators";

@Router("sub")
export class SubRouter {
  @Get("/a")
  getAll(req, res, next) {
    console.log("Hello sub");
  }
}
