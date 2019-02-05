import { Router, Get, Post } from "@decorators";
import { Auth } from "./Example.before";
import { Stat } from "./Example.after";
import { TestMiddlewares } from "./Example.middlewares";
import { ExampleModel } from "./Example.model";

@Router(
  "example"
)
export class ExampleRouter {
  @Get("/")
  async getAll(req, res, next) {
    console.log("Hello");
    res.send(await ExampleModel.find());
    next();
  }

  @Post("/")
  add(req, res, next) {
    console.log("Hello 2");
  }
}
