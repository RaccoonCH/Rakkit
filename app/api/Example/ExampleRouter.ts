import { Router, Get, Post } from "@decorators";

@Router("example")
export class ExampleRouter {
  @Get("/")
  getAll(req, res, next) {
    console.log("Hello");
    next();
  }

  @Post("/")
  getAll2() {
    console.log("Hello 2");
  }
}
