import * as Router from "koa-router";
import { sync as GlobSync } from "glob";
import { HandlerFunctionHelper } from "../../logic";
import {
  IAppConfig,
  MiddlewareType,
  ClassOrString,
  HandlerFunction
} from "../../types";

export class AppLoader {
  static loadMiddlewares(
    middlewaresToLoad: MiddlewareType[],
    router: Router,
    middlewares: ReadonlyMap<Object, HandlerFunction>
  ) {
    if (middlewaresToLoad) {
      const mws = middlewaresToLoad.reduce((prev, curr) => {
        const middleware = middlewares.get(curr);
        if (middleware) {
          return [
            ...prev,
            HandlerFunctionHelper.getWrappedHandlerFunction(middleware)
          ];
        }
        return prev;
      }, []);
      router.use(mws);
    }
  }

  LoadControllers(options: IAppConfig) {
    this.load(options.routers);
    this.load(options.websockets);
  }

  private load(items: ClassOrString[]) {
    if (items) {
      items.map((controller) => {
        if (typeof controller === "string") {
          const filePaths = GlobSync(controller);
          filePaths.map(require);
        } else {
          controller;
        }
      });
    }
  }
}
