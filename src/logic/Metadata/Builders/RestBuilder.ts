import { MetadataBuilder } from "./MetadataBuilder";
import {
  IDecorator,
  IMiddleware,
  HandlerFunction,
  IUsedMiddleware,
  IRouter,
  IEndpoint,
  ApiRouter,
  MetadataStorage,
  AppLoader,
  MiddlewareType,
  HandlerFunctionHelper,
  MiddlewareExecutionTime,
  Rakkit
} from "../../..";

export class RestBuilder extends MetadataBuilder {
  private _middlewares: Map<Function, IDecorator<IMiddleware>> = new Map();
  private _beforeMiddlewares: Map<Function, HandlerFunction> = new Map();
  private _afterMiddlewares: Map<Function, HandlerFunction> = new Map();
  private _usedMiddlewares: IDecorator<IUsedMiddleware>[] = [];
  private _routers: Map<Function, IDecorator<IRouter>> = new Map();
  private _endpoints: IDecorator<IEndpoint>[] = [];
  private _mainRouter: ApiRouter = new ApiRouter();
  private _restRouter: ApiRouter = new ApiRouter();

  get Middlewares() {
    return this._middlewares as ReadonlyMap<Object, IDecorator<IMiddleware>>;
  }

  get BeforeMiddlewares() {
    return this._beforeMiddlewares as ReadonlyMap<Object, HandlerFunction>;
  }

  get AfterMiddlewares() {
    return this._afterMiddlewares as ReadonlyMap<Object, HandlerFunction>;
  }

  get MainRouter() {
    return this._mainRouter as Readonly<ApiRouter>;
  }

  get RestRouter() {
    return this._restRouter as Readonly<ApiRouter>;
  }

  get Routers() {
    return this._routers as ReadonlyMap<Object, IDecorator<IRouter>>;
  }

  get Endpoints() {
    return this._endpoints as ReadonlyArray<IDecorator<IEndpoint>>;
  }

  Build() {
    this._middlewares.forEach((item) => {
      // If middleware is a class, instanciate it and use the "use" method as the middleware
      if (item.params.isClass) {
        const instance = MetadataStorage.Instance.Di.GetService(item.class);
        item.params.isClass = false;
        item.params.function = instance.use.bind(instance);
      }
      switch (item.params.executionTime) {
        case "AFTER":
          this._afterMiddlewares.set(item.class, item.params.function);
        break;
        case "BEFORE":
          this._beforeMiddlewares.set(item.class, item.params.function);
        break;
      }
    });
    this._restRouter = new ApiRouter({
      prefix: Rakkit.Instance.Config.restEndpoint
    });
    this._endpoints.map((item) => {
      const router = this._routers.get(item.class);
      // Look if the endpoint is already merged to another endpoinr
      const alreadyMerged = router.params.endpoints.find(endpoint =>
        endpoint.params.endpoint === item.params.endpoint &&
        endpoint.params.method === item.params.method &&
        endpoint.class === item.class
      );
      item.params.functions = this.getEndpointFunctions(item);
      if (!alreadyMerged) {
        // If multiple method are decorated with the same method and endpoint
        // merge the functions
        const endpointsToMerge = this._endpoints.filter((mergeItem) => {
          return item !== mergeItem &&
            item.class === mergeItem.class &&
            item.params.endpoint === mergeItem.params.endpoint &&
            item.params.method === mergeItem.params.method;
        });
        endpointsToMerge.map((endpoint) => {
          item.params.functions = item.params.functions.concat(this.getEndpointFunctions(endpoint));
        });
        router.params.endpoints.push(item);
      }
    });
    const routers = Array.from(this._routers.values());
    routers.map((item) => {
      // getUsedMiddleware merge
      const mws = this._usedMiddlewares.filter((usedMw) => {
        return (
          usedMw.class === item.class &&
          usedMw.class === usedMw.params.applyOn
        );
      });
      item.params.middlewares = this.extractMiddlewares(mws);
      this.mountEndpointsToRouter(item);
      this._restRouter.use(
        item.params.path,
        item.params.router.routes(),
        item.params.router.allowedMethods()
      );
    });

    const rootMiddlewares = Rakkit.Instance.Config.globalRootMiddlewares;
    const restMiddlewares = Rakkit.Instance.Config.globalRestMiddlewares;
    this._restRouter = this.mountMiddlewaresToRouter(
      restMiddlewares,
      this._restRouter
    );
    this._mainRouter.use(this._restRouter.routes());
    this._mainRouter = this.mountMiddlewaresToRouter(
      rootMiddlewares,
      this._mainRouter
    );
  }

  AddRouter(item: IDecorator<IRouter>) {
    item.params.path = this.normalizePath(item.params.path);
    const routerAlreadyExists = this.getRoutersByPath(item.params.path).length >= 1;
    if (routerAlreadyExists) {
      throw new Error(`Multiple routers have the path: ${item.params.path}`);
    } else {
      MetadataStorage.Instance.Di.AddService(item);
      this._routers.set(item.class, item);
    }
  }

  AddMiddleware(item: IDecorator<IMiddleware>) {
    MetadataStorage.Instance.Di.AddService(item);
    this._middlewares.set(item.class, item);
  }

  AddUsedMiddleware(item: IDecorator<IUsedMiddleware>) {
    this._usedMiddlewares.push(item);
  }

  AddEndpoint(item: IDecorator<IEndpoint>) {
    item.params.endpoint = this.normalizePath(item.params.endpoint);
    this._endpoints.push(item);
  }

  GetBeforeMiddlewares(middlewares: MiddlewareType[]) {
    return this.getBeforeAfterMiddlewares(middlewares, "BEFORE");
  }

  GetAfterMiddlewares(middlewares: MiddlewareType[]) {
    return this.getBeforeAfterMiddlewares(middlewares, "AFTER");
  }

  private getUsedMiddlewares(endpoint: IDecorator<IEndpoint>) {
    return this._usedMiddlewares.filter((usedMw) => {
      return (
        usedMw.class === endpoint.class &&
        endpoint.params.functions[0] === usedMw.params.applyOn
      );
    });
  }

  private mountMiddlewaresToRouter(middlewares: MiddlewareType[], router: ApiRouter) {
    const tempRouter = new ApiRouter(router.opts);
    const restBeforeMiddlewares = this.GetBeforeMiddlewares(middlewares);
    const restAfterMiddlewares = this.GetAfterMiddlewares(middlewares);
    tempRouter.use(...restBeforeMiddlewares);
    tempRouter.use(router.prefix("/").routes());
    tempRouter.use(...restAfterMiddlewares);

    return tempRouter;
  }

  private getBeforeAfterMiddlewares(middlewares: MiddlewareType[], beforeAfter: MiddlewareExecutionTime) {
    if (middlewares) {
      return middlewares.reduce<HandlerFunction[]>((arr, item) => {
        let foundMiddleware = this._middlewares.get(item);
        if (!foundMiddleware) {
          foundMiddleware = {
            class: item,
            key: (item as HandlerFunction).name,
            category: "rest",
            params: {
              executionTime: "BEFORE",
              function: (item as HandlerFunction),
              isClass: false
            }
          };
        }
        if (foundMiddleware.params.executionTime === beforeAfter) {
          return [
            ...arr,
            foundMiddleware.params.function
          ];
        }
        return arr;
      }, []);
    }
    return [];
  }

  private mountEndpointsToRouter(router: IDecorator<IRouter>) {
    router.params.router = new ApiRouter();
    this.loadMiddlewares(router.params, this._beforeMiddlewares);
    router.params.endpoints.map((endpoint) => {
      const method = endpoint.params.method.toLowerCase();
      const functions = endpoint.params.functions.map((fn) =>
        HandlerFunctionHelper.getWrappedHandlerFunction(fn as HandlerFunction)
      );
      router.params.router[method](
        `${endpoint.params.endpoint}`,
        ...functions
      );
    });
    this.loadMiddlewares(router.params, this._afterMiddlewares);
  }

  private getEndpointFunctions(endpoint: IDecorator<IEndpoint>) {
    const endpointUsedMiddlewares = this.getUsedMiddlewares(endpoint);
    const endpointMiddlewares = this.extractMiddlewares(endpointUsedMiddlewares);
    const compiledMergedEnpoint: Function[] = [
      ...this.GetBeforeMiddlewares(endpointMiddlewares),
      ...this.bindContext(endpoint, endpoint.params.functions),
      ...this.GetAfterMiddlewares(endpointMiddlewares)
    ];
    return compiledMergedEnpoint;
  }

  private loadMiddlewares(router: IRouter, middlewares: Map<Object, HandlerFunction>) {
    AppLoader.loadMiddlewares(
      router.middlewares,
      router.router,
      middlewares
    );
  }

  private extractMiddlewares(arr: IDecorator<IUsedMiddleware>[]): MiddlewareType[] {
    return arr.reduce((prev, curr) => [
      ...prev,
      ...curr.params.middlewares
    ], []);
  }

  /**
   * Get a router by his path
   * @param path The router path
   */
  private getRoutersByPath(path: string) {
    return Array.from(this._routers.values()).filter((router) =>
      router.params.path === path
    );
  }
}
