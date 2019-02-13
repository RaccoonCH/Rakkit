import { Router, Get } from "@decorators";
import { IContext, NextFunction } from "@types";
import { Before } from "./Example.before";
import { After } from "./Example.after";

@Router("example", [Before, After])
export class ExampleRouter {
  @Get("/")
  async getAll({ context }: IContext, next: NextFunction) {
    console.log("hello");
    next();
  }
}
