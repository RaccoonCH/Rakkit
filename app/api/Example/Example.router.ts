import { Router, Get, Post } from "@decorators";

@Router("example")
export class ExampleRouter {
  @Get("/")
  getAll(req, res, next) {
    console.log("Hello");
  }

  @Post("/")
  add(req, res, next) {
    console.log("Hello 2");
  }
}
