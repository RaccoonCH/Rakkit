import {
  AfterMiddleware,
  IBaseMiddleware,
  Context
} from "../../../src";

@AfterMiddleware()
export class SecondAfterMiddleware implements IBaseMiddleware {
  async use(context: Context) {
    context.body += "a2;";
  }
}
