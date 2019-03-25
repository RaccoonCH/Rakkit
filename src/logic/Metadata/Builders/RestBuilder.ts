import { Middleware } from "koa";
import { MetadataBuilder } from "./MetadataBuilder";
import {
  IDecorator,
  HandlerFunction,
  IRouter,
  IEndpoint,
  ApiRouter,
  MetadataStorage,
  MiddlewareType,
  Rakkit
} from "../../..";

export class RestBuilder extends MetadataBuilder {
  private _routers: Map<Function, IDecorator<IRouter>> = new Map();
  private _endpoints: IDecorator<IEndpoint>[] = [];
  private _mainRouter: ApiRouter = new ApiRouter();
  private _restRouter: ApiRouter = new ApiRouter();

  private get _routingStorage() {
    return MetadataStorage.Instance.Routing;
  }

  get MainRouter() {
    return this._mainRouter as Readonly<ApiRouter>;
  }

  get RestRouter() {
    return this._restRouter as Readonly<ApiRouter>;
  }

  get Routers() {
    return this._routers as ReadonlyMap<Function, IDecorator<IRouter>>;
  }

  get Endpoints() {
    return this._endpoints as ReadonlyArray<IDecorator<IEndpoint>>;
  }

  Build() {
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
      const mws = this._routingStorage.UsedMiddlewares.filter((usedMw) => {
        return (
          usedMw.class === item.class &&
          usedMw.class === usedMw.params.applyOn
        );
      });
      item.params.middlewares = this._routingStorage.ExtractMiddlewares(mws);
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

  AddEndpoint(item: IDecorator<IEndpoint>) {
    item.params.endpoint = this.normalizePath(item.params.endpoint);
    this._endpoints.push(item);
  }

  private mountMiddlewaresToRouter(middlewares: MiddlewareType[], router: ApiRouter) {
    const tempRouter = new ApiRouter(router.opts);
    const restBeforeMiddlewares = this._routingStorage.GetBeforeMiddlewares(middlewares);
    const restAfterMiddlewares = this._routingStorage.GetAfterMiddlewares(middlewares);
    tempRouter.use(...restBeforeMiddlewares as Middleware[]);
    tempRouter.use(router.prefix("/").routes());
    tempRouter.use(...restAfterMiddlewares as Middleware[]);

    return tempRouter;
  }

  private mountEndpointsToRouter(router: IDecorator<IRouter>) {
    router.params.router = new ApiRouter();
    this.loadMiddlewares(router.params, this._routingStorage.BeforeMiddlewares);
    router.params.endpoints.map((endpoint) => {
      const method = endpoint.params.method.toLowerCase();
      const functions = endpoint.params.functions.map((fn) =>
        this._routingStorage.GetWrappedHandlerFunction(fn as HandlerFunction)
      );
      router.params.router[method](
        `${endpoint.params.endpoint}`,
        ...functions
      );
    });
    this.loadMiddlewares(router.params, this._routingStorage.AfterMiddlewares);
  }

  private getEndpointFunctions(endpoint: IDecorator<IEndpoint>) {
    const endpointUsedMiddlewares = this._routingStorage.GetUsedMiddlewares(endpoint, endpoint.params.functions[0]);
    const endpointMiddlewares = this._routingStorage.ExtractMiddlewares(endpointUsedMiddlewares);
    const compiledMergedEnpoint: Function[] = [
      ...this._routingStorage.GetBeforeMiddlewares(endpointMiddlewares),
      ...this.bindContext(endpoint, endpoint.params.functions),
      ...this._routingStorage.GetAfterMiddlewares(endpointMiddlewares)
    ];
    return compiledMergedEnpoint;
  }

  private loadMiddlewares(router: IRouter, middlewares: Map<Object, HandlerFunction>) {
     this._routingStorage.LoadMiddlewares(
      router.middlewares,
      router.router,
      middlewares
    );
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
