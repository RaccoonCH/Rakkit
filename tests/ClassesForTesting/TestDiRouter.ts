import { EndpointFirstBeforeMiddleware } from "./Middlewares/Endpoint/BeforeMiddlewares/EndpointFirstBeforeMiddleware";
import { RouterFirstBeforeMiddleware } from "./Middlewares/Router/Before/RouterFirstBeforeMiddleware";
import { Router, Get, Inject, Context, UseMiddleware, NextFunction } from "../../src";
import { TestService } from "./TestService";


@Router("test-di")
@UseMiddleware(RouterFirstBeforeMiddleware)
export class TestDiRouter {
  @Inject()
  private _testService: TestService;

  @Get("/")
  @UseMiddleware(EndpointFirstBeforeMiddleware)
  async get(context: Context, next: NextFunction) {
    this._testService.TestValue.testDi = true;
    context.body = this._testService.TestValue;
    await next();
  }
}
