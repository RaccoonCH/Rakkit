import { EndpointSecondBeforeMiddleware } from "./Middlewares/Endpoint/BeforeMiddlewares/EndpointSecondBeforeMiddleware";
import { EndpointFirstBeforeMiddleware } from "./Middlewares/Endpoint/BeforeMiddlewares/EndpointFirstBeforeMiddleware";
import { EndpointSecondAfterMiddleware } from "./Middlewares/Endpoint/AfterMiddlewares/EndpointSecondAfterMiddleware";
import { EndpointFirstAfterMiddleware } from "./Middlewares/Endpoint/AfterMiddlewares/EndpointFirstAfterMiddleware";
import { RouterSecondBeforeMiddleware } from "./Middlewares/Router/Before/RouterSecondBeforeMiddleware";
import { RouterFirstBeforeMiddleware } from "./Middlewares/Router/Before/RouterFirstBeforeMiddleware";
import { RouterSecondAfterMiddleware } from "./Middlewares/Router/After/RouterSecondAfterMiddleware";
import { RouterFirstAfterMiddleware } from "./Middlewares/Router/After/RouterFirstAfterMiddleware";
import {
  Router,
  Get,
  Context,
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
  get(context: Context, next: NextFunction) {
    context.body += "hello world;";
    next();
  }

  @Get("/mw")
  @UseMiddleware(
    EndpointFirstAfterMiddleware,
    EndpointFirstBeforeMiddleware,
    EndpointSecondBeforeMiddleware,
    EndpointSecondAfterMiddleware
  )
  getMw(context: Context, next: NextFunction) {
    context.body += "0;";
    next();
  }

  @Get("/merge")
  merge1(context: Context, next: NextFunction) {
    context.body += "-1;";
    next();
  }
  @Get("/merge")
  merge2(context: Context, next: NextFunction) {
    context.body += "0;";
    next();
  }

  @Get("/merge-mw")
  @UseMiddleware(
    EndpointFirstBeforeMiddleware,
    EndpointFirstAfterMiddleware
  )
  mergeMw1(context: Context, next: NextFunction) {
    context.body += "-1;";
    next();
  }
  @Get("/merge-mw")
  @UseMiddleware(
    EndpointSecondBeforeMiddleware,
    EndpointSecondAfterMiddleware
  )
  mergeMw2(context: Context, next: NextFunction) {
    context.body += "0;";
    next();
  }

  @Get("/merge-mw3/:param")
  @UseMiddleware(
    EndpointFirstBeforeMiddleware,
    EndpointFirstAfterMiddleware
  )
  mergeMw31(context: Context, next: NextFunction) {
    context.body += "-2;";
    next();
  }
  @Get("/merge-mw3/:param")
  @UseMiddleware(
    EndpointSecondBeforeMiddleware,
    EndpointSecondAfterMiddleware
  )
  mergeMw32(context: Context, next: NextFunction) {
    context.body += "-1;";
    next();
  }
  @Get("/merge-mw3/:param")
  @UseMiddleware(
    EndpointSecondBeforeMiddleware,
    EndpointSecondAfterMiddleware
  )
  mergeMw33(context: Context, next: NextFunction) {
    context.body += `${context.params.param};`;
    next();
  }
}
