import { Router, Express } from "express";
import { sync as GlobSync } from "glob";
import { IAppConfig, MiddlewareType, ClassOrString, HandlerFunction } from "@types";
import { HandlerFunctionHelper } from "@logic";

export class AppLoader {
  static loadMiddlewares(
    middlewaresToLoad: MiddlewareType[],
    expressApp: Express | Router,
    middlewares: Map<Object, HandlerFunction>
  ) {
    if (middlewaresToLoad) {
      middlewaresToLoad.map((item) => {
        const middleware = middlewares.get(item);
        if (middleware) {
          expressApp.use(HandlerFunctionHelper.getWrappedHandlerFunction(middleware));
        }
      });
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
        }
      });
    }
  }
}
