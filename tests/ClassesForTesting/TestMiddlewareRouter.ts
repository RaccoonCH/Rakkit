import { EndpointSecondBeforeMiddleware } from "./Middlewares/Endpoint/Before/EndpointSecondBeforeMiddleware";
import { EndpointFirstBeforeMiddleware } from "./Middlewares/Endpoint/Before/EndpointFirstBeforeMiddleware";
import { EndpointSecondAfterMiddleware } from "./Middlewares/Endpoint/After/EndpointSecondAfterMiddleware";
import { EndpointFirstAfterMiddleware } from "./Middlewares/Endpoint/After/EndpointFirstAfterMiddleware";
import { RouterSecondBeforeMiddleware } from "./Middlewares/Router/Before/RouterSecondBeforeMiddleware";
import { RouterFirstBeforeMiddleware } from "./Middlewares/Router/Before/RouterFirstBeforeMiddleware";
import { RouterSecondAfterMiddleware } from "./Middlewares/Router/After/RouterSecondAfterMiddleware";
import { RouterFirstAfterMiddleware } from "./Middlewares/Router/After/RouterFirstAfterMiddleware";
import { wait } from "../Utils/Waiter";
import {
  Router,
  Get,
  IContext,
  UseMiddleware,
  NextFunction
} from "../../src";

@Router("test-middleware")
@UseMiddleware(
  RouterFirstBeforeMiddleware,
  RouterFirstAfterMiddleware,
  RouterSecondAfterMiddleware,
  RouterSecondBeforeMiddleware
)
export class TestMiddlewareRouter {
  @Get("/")
  async get(context: IContext, next: NextFunction) {
    await wait();
    context.body += "hello world;";
    await next();
  }

  @Get("/mw")
  @UseMiddleware(
    EndpointFirstAfterMiddleware,
    EndpointFirstBeforeMiddleware,
    EndpointSecondBeforeMiddleware,
    EndpointSecondAfterMiddleware
  )
  async getMw(context: IContext, next: NextFunction) {
    await wait();
    context.body += "0;";
    await next();
  }

  @Get("/merge")
  async merge1(context: IContext, next: NextFunction) {
    await wait();
    context.body += "-1;";
    await next();
  }
  @Get("/merge")
  async merge2(context: IContext, next: NextFunction) {
    await wait();
    context.body += "0;";
    await next();
  }

  @Get("/merge-mw")
  @UseMiddleware(
    EndpointFirstBeforeMiddleware,
    EndpointFirstAfterMiddleware
  )
  async mergeMw1(context: IContext, next: NextFunction) {
    await wait();
    context.body += "-1;";
    await next();
  }
  @Get("/merge-mw")
  @UseMiddleware(
    EndpointSecondBeforeMiddleware,
    EndpointSecondAfterMiddleware
  )
  async mergeMw2(context: IContext, next: NextFunction) {
    await wait();
    context.body += "0;";
    await next();
  }

  @Get("/merge-mw3/:param")
  @UseMiddleware(
    EndpointFirstBeforeMiddleware,
    EndpointFirstAfterMiddleware
  )
  async mergeMw31(context: IContext, next: NextFunction) {
    await wait();
    context.body += "-2;";
    await next();
  }
  @Get("/merge-mw3/:param")
  @UseMiddleware(
    EndpointSecondBeforeMiddleware,
    EndpointSecondAfterMiddleware
  )
  async mergeMw32(context: IContext, next: NextFunction) {
    await wait();
    context.body += "-1;";
    await next();
  }
  @Get("/merge-mw3/:param")
  @UseMiddleware(
    EndpointSecondBeforeMiddleware,
    EndpointSecondAfterMiddleware
  )
  async mergeMw33(context: IContext, next: NextFunction) {
    await wait();
    context.body += `${context.params.param};`;
    await next();
  }
}
