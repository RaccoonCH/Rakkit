import { Router, Get, Context, UseMiddleware, NextFunction } from "../../src";
import { FirstAfterMiddleware } from "./AfterMiddleware/FirstMiddleware";
import { FirstBeforeMiddleware } from "./BeforeMiddlewares/FirstMiddleware";
import { SecondBeforeMiddleware } from "./BeforeMiddlewares/SecondMiddleware";
import { SecondAfterMiddleware } from "./AfterMiddleware/SecondMiddleware";

@Router("test")
export class TestRouter {
  @Get("/")
  get(context: Context) {
    context.body = "hello world";
    context.status = 200;
  }

  @Get("/mw")
  @UseMiddleware(
    FirstAfterMiddleware,
    FirstBeforeMiddleware,
    SecondBeforeMiddleware,
    SecondAfterMiddleware
  )
  getMw(context: Context, next: NextFunction) {
    context.body += "0;";
    next();
  }

  @Get("/merge")
  merge1(context: Context, next: NextFunction) {
    context.body = "-1;";
    next();
  }
  @Get("/merge")
  merge2(context: Context) {
    context.body += "0;";
  }

  @Get("/merge-mw")
  @UseMiddleware(FirstBeforeMiddleware, FirstAfterMiddleware)
  mergeMw1(context: Context, next: NextFunction) {
    context.body += "-1;";
    next();
  }
  @Get("/merge-mw")
  @UseMiddleware(SecondBeforeMiddleware, SecondAfterMiddleware)
  mergeMw2(context: Context, next: NextFunction) {
    context.body += "0;";
    next();
  }
}
