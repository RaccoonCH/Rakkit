import { NextFunction } from "express";
import { Router, Get, Post } from "@decorators";
import { IContext } from "@types";
import { TestMiddlewares } from "./Example.middlewares";
import { ExampleModel } from "./Example.model";
import { Auth } from "./Example.before";
import { Stat } from "./Example.after";

@Router(
  "example"
)
export class ExampleRouter {
  @Get("/", [
    Stat
  ])
  async getAll({ res, next }: IContext) {
    console.log("Hello");
    res.send(await ExampleModel.find());
    next();
  }

  @Post("/")
  add(context: IContext, next: NextFunction) {
    console.log("Hello 2");
  }
}
