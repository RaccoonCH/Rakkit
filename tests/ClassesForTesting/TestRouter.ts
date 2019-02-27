import {
  Router,
  Get,
  Context,
  Post,
  Put,
  Delete,
  Inject
} from "../../src";
import { TestService } from "./TestService";

@Router("test")
export class TestMiddlewareRouter {
  @Inject()
  _a: TestService;
  @Inject(1)
  _b: TestService;

  @Get()
  get(context: Context) {
    context.body = this.getReturnedBody(context);
  }
  @Get("/:param")
  getParam(context: Context) {
    context.body = this.getReturnedBody(context);
  }

  @Post("/")
  post(context: Context) {
    context.body = this.getReturnedBody(context);
  }
  @Post("/:param")
  postParam(context: Context) {
    context.body = this.getReturnedBody(context);
  }

  @Put("/")
  put(context: Context) {
    context.body = this.getReturnedBody(context);
  }
  @Put("/:param")
  putParam(context: Context) {
    context.body = this.getReturnedBody(context);
  }

  @Delete()
  delete(context: Context) {
    context.body = this.getReturnedBody(context);
  }
  @Delete("/:param")
  deleteParam(context: Context) {
    context.body = this.getReturnedBody(context);
  }

  private getReturnedBody(context: Context) {
    return {
      method: context.method,
      params: context.params,
      body: context.request.body
    };
  }
}
