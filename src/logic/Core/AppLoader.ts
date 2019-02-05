import { RequestHandlerParams } from "express-serve-static-core";
import { Router, Express } from "express";
import { sync as GlobSync } from "glob";
import { IAppConfig, MiddlewareType, ClassOrString } from "@types";

export class AppLoader {
  static loadMiddlewares(
    middlewaresToLoad: MiddlewareType[],
    expressApp: Express | Router,
    middlewares: Map<Object, RequestHandlerParams>
  ) {
    if (middlewaresToLoad) {
      middlewaresToLoad.map((item) => {
        const middleware = middlewares.get(item);
        if (middleware) {
          expressApp.use(middleware);
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
