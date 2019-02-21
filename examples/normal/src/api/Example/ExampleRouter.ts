import { Router, Get, Inject, IContext } from "../../../../../src";
import { ExampleService } from "./ExampleService";

@Router("example")
export class ExampleRouter {
  @Inject()
  private _routerService: ExampleService;

  @Get("/")
  get(context: IContext) {
    context.context.body = "Hello world";
  }
}
