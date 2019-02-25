import {
  IBaseMiddleware,
  IContext,
  AfterMiddleware
} from "../../../../src";

@AfterMiddleware()
export class GoodbyeMiddleware implements IBaseMiddleware {
  async use (context: IContext) {
    console.log("Goodbye");
  }
}
