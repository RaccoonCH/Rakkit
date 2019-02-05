import { Router, Get, Post } from "@decorators";
import { Auth } from "./Example.middleware";
import { Stat } from "./Example.finisher";

@Router(
  "example"
)
export class ExampleRouter {
  @Get(
    "/",
    [Stat]
  )
  getAll(req, res, next) {
    console.log("Hello");
    next();
  }

  @Post("/")
  add(req, res, next) {
    console.log("Hello 2");
  }
}
