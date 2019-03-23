import {
  Router,
  Get,
  IContext,
  Post,
  Put,
  Delete,
  Inject
} from "../../src";
import { TestService } from "./TestService";
import { wait } from "../Utils/Waiter";

@Router("test")
export class TestMiddlewareRouter {
  @Inject()
  _a: TestService;
  @Inject(1)
  _b: TestService;

  @Get()
  async get(context: IContext) {
    await wait();
    context.body = this.getReturnedBody(context);
  }
  @Get("/:param")
  async getParam(context: IContext) {
    await wait();
    context.body = this.getReturnedBody(context);
  }

  @Post("/")
  async post(context: IContext) {
    await wait();
    context.body = this.getReturnedBody(context);
  }
  @Post("/:param")
  async postParam(context: IContext) {
    await wait();
    context.body = this.getReturnedBody(context);
  }

  @Put("/")
  async put(context: IContext) {
    await wait();
    context.body = this.getReturnedBody(context);
  }
  @Put("/:param")
  async putParam(context: IContext) {
    await wait();
    context.body = this.getReturnedBody(context);
  }

  @Delete()
  async delete(context: IContext) {
    await wait();
    context.body = this.getReturnedBody(context);
  }
  @Delete("/:param")
  async deleteParam(context: IContext) {
    await wait();
    context.body = this.getReturnedBody(context);
  }

  private getReturnedBody(context: IContext) {
    return {
      method: context.method,
      params: context.params,
      body: context.request.body
    };
  }
}
