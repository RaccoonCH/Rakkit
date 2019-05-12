import * as KoaCompose from "koa-compose";
import * as Router from "koa-router";
import * as Koa from "koa";
import { MetadataBuilder } from "../../../Packages/Core/Logic/MetadataBuilder";
import {
  IDecorator,
  IMiddleware,
  HandlerFunction,
  IUsedMiddleware,
  MetadataStorage,
  MiddlewareType,
  MiddlewareExecutionTime,
  NextFunction,
  IContext
} from "../../..";

export class RoutingMetadataBuilder extends MetadataBuilder {
  private _middlewares: Map<Function, IDecorator<IMiddleware>> = new Map();
  private _beforeMiddlewares: Map<Function, HandlerFunction> = new Map();
  private _afterMiddlewares: Map<Function, HandlerFunction> = new Map();
  private _usedMiddlewares: IDecorator<IUsedMiddleware>[] = [];

  get UsedMiddlewares() {
    return this._usedMiddlewares as ReadonlyArray<IDecorator<IUsedMiddleware>>;
  }

  get Middlewares() {
    return this._middlewares as Map<Function, IDecorator<IMiddleware>>;
  }

  get BeforeMiddlewares() {
    return this._beforeMiddlewares as Map<Function, HandlerFunction>;
  }

  get AfterMiddlewares() {
    return this._afterMiddlewares as Map<Function, HandlerFunction>;
  }

  AddMiddleware(item: IDecorator<IMiddleware>) {
    MetadataStorage.Instance.Di.AddService(item);
    this._middlewares.set(item.originalClass, item);
  }

  AddUsedMiddleware(item: IDecorator<IUsedMiddleware>) {
    this._usedMiddlewares.push(item);
  }

  Build() {
    this._middlewares.forEach((item) => {
      // If middleware is a class, instanciate it and use the "use" method as the middleware
      if (item.params.isClass) {
        const instance = MetadataStorage.Instance.Di.GetService(item.originalClass);
        item.params.isClass = false;
        item.params.function = instance.use.bind(instance);
      }
      switch (item.params.executionTime) {
        case "AFTER":
          this._afterMiddlewares.set(item.originalClass, item.params.function);
        break;
        case "BEFORE":
          this._beforeMiddlewares.set(item.originalClass, item.params.function);
        break;
      }
    });
  }

  GetBeforeMiddlewares(middlewares: MiddlewareType[]) {
    return this.GetBeforeAfterMiddlewares(middlewares, "BEFORE");
  }

  GetAfterMiddlewares(middlewares: MiddlewareType[]) {
    return this.GetBeforeAfterMiddlewares(middlewares, "AFTER");
  }

  GetBeforeAfterMiddlewares(middlewares: MiddlewareType[], beforeAfter: MiddlewareExecutionTime) {
    if (middlewares) {
      this.LoadAnonymousMiddlewares(middlewares);
      return middlewares.reduce<HandlerFunction[]>((arr, item) => {
        const foundMiddleware = this._middlewares.get(item);
        if (foundMiddleware && foundMiddleware.params.executionTime === beforeAfter) {
          arr.push(foundMiddleware.params.function);
        }
        return arr;
      }, []);
    }
    return [];
  }

  AnonymousFnToMw(mw: MiddlewareType): IDecorator<IMiddleware> {
    const fnMw = mw as HandlerFunction;
    return {
      originalClass: fnMw,
      class: fnMw,
      key: fnMw.name,
      category: "rest",
      params: {
        executionTime: "BEFORE",
        function: fnMw,
        isClass: false
      }
    };
  }

  LoadAnonymousMiddlewares(middlewares: MiddlewareType[]) {
    return middlewares.map((mw) => {
      const foundMiddleware = this._middlewares.get(mw);
      if (!foundMiddleware) {
        const newMw = this.AnonymousFnToMw(mw);
        this._middlewares = new Map([
          [mw, newMw],
          ...this._middlewares
        ]);
        return newMw;
      }
      return mw;
    });
  }

  LoadMiddlewares(
    middlewaresToLoad: MiddlewareType[],
    router: Router | Koa,
    middlewares: ReadonlyMap<Object, HandlerFunction>
  ) {
    if (middlewaresToLoad) {
      const mws: HandlerFunction[] = middlewaresToLoad.reduce((prev, curr) => {
        const middleware = middlewares.get(curr);
        if (middleware) {
          return [
            ...prev,
            this.GetWrappedHandlerFunction(middleware)
          ];
        }
        return prev;
      }, []);
      router.use(KoaCompose(mws as KoaCompose.Middleware<any>[]));
    }
  }

  GetUsedMiddlewares(decorator: IDecorator<any>, fn?: Function) {
    // Reverse to have the correct execution time
    return this._usedMiddlewares.filter((usedMw) => {
      return (
        usedMw.originalClass === decorator.originalClass &&
        (fn ? fn === usedMw.params.applyOn : true)
      );
    }).reverse();
  }

  ExtractMiddlewares(arr: IDecorator<IUsedMiddleware>[]): MiddlewareType[] {
    return arr.reduce((prev, curr) => [
      ...prev,
      ...curr.params.middlewares
    ], []);
  }

  GetWrappedHandlerFunction(handler: HandlerFunction): Koa.Middleware {
    return async (context: IContext, next: NextFunction) => {
      context.apiType = "rest";
      await handler(context, next);
    };
  }
}
