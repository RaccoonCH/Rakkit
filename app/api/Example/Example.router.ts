import { NextFunction } from "express";
import { Router, Get, Post } from "@decorators";
import { IContext } from "@types";
import { TestMiddlewares } from "./Example.middlewares";
import { ExampleModel } from "./Example.model";
import { Auth } from "./Example.before";
import { Stat } from "./Example.after";
import { Before } from "./Example.resolver";

@Router(
  "example"
)
export class ExampleRouter {
  @Get("/", [
    Stat
  ])
  async getAll({ res }: IContext, next) {
    console.log("Hello");
    res.send(await ExampleModel.find());
    next();
  }

  @Post("/", [Before])
  add(context: IContext, next: NextFunction) {
    console.log(context, "Hello 2");
  }
}
