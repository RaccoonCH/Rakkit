import * as Router from "koa-router";
import { Middleware } from "koa";
import {
  AppLoader,
  HandlerFunctionHelper
} from "..";
import {
  IDecorator,
  IRouter,
  IEndpoint,
  HttpMethod,
  MiddlewareType,
  IMiddleware,
  MiddlewareExecutionTime,
  IOn,
  HandlerFunction,
  IUsedMiddleware,
  IService,
  IInject,
  IClassType,
  IWebsocket,
  IBaseMiddleware
} from "../../types";

export class MetadataStorage {
  //#region Declarations
  private static _instance: MetadataStorage;
  // REST
  private _routers: Map<Object, IDecorator<IRouter>> = new Map();
  private _endpoints: IDecorator<IEndpoint>[] = [];
  private _middlewares: Map<Object, IDecorator<IMiddleware>> = new Map();
  private _beforeMiddlewares: Map<Object, HandlerFunction> = new Map();
  private _afterMiddlewares: Map<Object, HandlerFunction> = new Map();
  private _usedMiddlewares: IDecorator<IUsedMiddleware>[] = [];
  private _compiledRouter: Router = new Router();
  // DI
  private _services: Map<Object, IDecorator<IService>> = new Map();
  private _injections: IDecorator<IInject>[] = [];
  // WS
  private _websockets: Map<Object, IDecorator<IWebsocket>> = new Map();
  private _ons: IDecorator<IOn>[] = [];
  //#endregion

  //#region Getters
  static get Instance() {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
    return this._instance;
  }

  get MainRouter() {
    return this._compiledRouter as Readonly<Router>;
  }

  get BeforeMiddlewares() {
    return this._beforeMiddlewares as ReadonlyMap<Object, HandlerFunction>;
  }

  get AfterMiddlewares() {
    return this._afterMiddlewares as ReadonlyMap<Object, HandlerFunction>;
  }

  get Middlewares() {
    return this._middlewares as ReadonlyMap<Object, IDecorator<IMiddleware>>;
  }

  get Ons() {
    return this._ons as ReadonlyArray<IDecorator<IOn>>;
  }

  get Endpoints() {
    return this._endpoints as ReadonlyArray<IDecorator<IEndpoint>>;
  }

  get Services() {
    return this._services as ReadonlyMap<Object, IDecorator<IService>>;
  }

  get Routers() {
    return this._routers as ReadonlyMap<Object, IDecorator<IRouter>>;
  }
  //#endregion

  //#region Decorators functions
  static getAddEndPointDecorator(method: HttpMethod) {
    return (endpoint: string): Function => {
      return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
        this.Instance.AddEndpoint({
          class: target.constructor,
          key,
          params: {
            endpoint,
            method,
            functions: [descriptor.value],
            middlewares: []
          }
        });
      };
    };
  }

  static getAddMiddlewareDecorator(executionTime: MiddlewareExecutionTime) {
    return (): Function => {
      return (target: Function, key: string, descriptor: PropertyDescriptor): void => {
        const isClass = !key;
        const finalKey = isClass ? target.name : key;
        const finalFunc = isClass ? target : descriptor.value;
        this.Instance.AddMiddleware({
          class: finalFunc,
          key: finalKey,
          params: {
            executionTime,
            function: finalFunc,
            isClass
          }
        });
      };
    };
  }
  //#endregion

  //#region Add-ers
  AddWebsocket(item: IDecorator<IWebsocket>) {
    this.addAsService(item);
    this._websockets.set(item.class, item);
  }

  AddRouter(item: IDecorator<IRouter>) {
    this.addAsService(item);
    this._routers.set(item.class, {
      ...item,
      params: {
        ...item.params
      }
    });
  }

  AddMiddleware(item: IDecorator<IMiddleware>) {
    // If middleware is a class, instanciate it and use the "use" method as the middleware
    if (item.params.isClass) {
      const instance = this.addAsService(item);
      item.params.isClass = false;
      item.params.function = (instance as IBaseMiddleware).use.bind(instance);
    }
    switch (item.params.executionTime) {
      case "AFTER":
        this._afterMiddlewares.set(item.class, item.params.function);
      break;
      case "BEFORE":
        this._beforeMiddlewares.set(item.class, item.params.function);
      break;
    }
    this._middlewares.set(item.class, item);
  }

  AddService(item: IDecorator<IService>) {
    this._services.set(item.class, item);
  }

  AddUsedMiddleware(item: IDecorator<IUsedMiddleware>) {
    this._usedMiddlewares.push(item);
  }

  AddEndpoint(item: IDecorator<IEndpoint>) {
    this._endpoints.push(item);
  }

  AddOn(item: IDecorator<IOn>) {
    this._ons.push(item);
  }

  AddInjection(item: IDecorator<IInject>) {
    this._injections.push(item);
  }
  //#endregion

  //#region Build
  async BuildAll() {
    this.buildInjections();
    this.buildRouters();
    this.buildWebsockets();
  }

  private buildWebsockets() {
    this._ons.map((item) => {
      const wsClass = this._websockets.get(item.class);
      item.params.function = this.bindContext(wsClass, item.params.function);
    });
  }

  private buildInjections() {
    this._injections.map((item) => {
      const destinationService = this._services.get(item.class);
      const valueService = this._services.get(item.params.injectionType);
      if (destinationService && valueService) {
        const instance = valueService.params.instance;
        destinationService.params.instance[item.key] = instance;
      }
    });
  }

  private async buildRouters() {
    this._endpoints.map((item) => {
      const router = this._routers.get(item.class);
      const mws = this._usedMiddlewares.filter((usedMw) => {
        return (
          usedMw.class === item.class &&
          item.params.functions[0] === usedMw.params.applyOn
        );
      });
      item.params.middlewares = this.extractMiddlewares(mws);
      const alreadyMerged = router.params.endpoints.find(
        endpoint => endpoint.functions.indexOf(item.params.functions[0]) > -1
      );
      if (!alreadyMerged) {
        // If multiple method are decorated with the same method and endpoint
        // merge the functions
        const endpointsToMerge = this._endpoints.filter((mergeItem) => {
          return item !== mergeItem &&
            item.class === mergeItem.class &&
            item.params.endpoint === mergeItem.params.endpoint &&
            item.params.method === mergeItem.params.method;
        });
        const mergedFunctions: Middleware[] = [
          ...item.params.functions,
          ...(endpointsToMerge.reduce((prev, item) => {
            return [
              ...prev,
              ...item.params.functions
            ];
          }, []))
        ];
        item.params.functions = this.bindContext(item, mergedFunctions);
        router.params.endpoints.push(item.params);
      }
    });
    const routers = Array.from(this._routers.values());
    routers.map((item) => {
      const mws = this._usedMiddlewares.filter((usedMw) => {
        return (
          usedMw.class === item.class &&
          usedMw.class === usedMw.params.applyOn
        );
      });
      item.params.middlewares = this.extractMiddlewares(mws);
      this.mountEndpointsToRouter(item);
      this._compiledRouter.use(
        `/${item.params.path}`,
        item.params.router.routes(),
        item.params.router.allowedMethods()
      );
    });
  }
  //#endregion

  //#region Util methods
  private loadMiddlewares(router: IRouter, middlewares: Map<Object, HandlerFunction>) {
    AppLoader.loadMiddlewares(
      router.middlewares,
      router.router,
      middlewares
    );
  }

  private bindContext(context: IDecorator<any>, fn: Function): Function;
  private bindContext(context: IDecorator<any>, fns: Function[]): Function[];
  private bindContext(context: IDecorator<any>, fnsOrFn: Function[] | Function) : Function[] | Function {
    const instance = this._services.get(context.class).params.instance;
    if (Array.isArray(fnsOrFn)) {
      return fnsOrFn.map(
        (fn) => fn.bind(instance)
      );
    }
    return fnsOrFn.bind(instance);
  }

  private getBeforeAfterMiddlewares(middlewares: MiddlewareType[], beforeAfter: MiddlewareExecutionTime) {
    return middlewares.reduce((arr, item) => {
      const foundMiddleware = this._middlewares.get(item);
      if (foundMiddleware.params.executionTime === beforeAfter) {
        return [
          ...arr,
          foundMiddleware.params.function
        ];
      }
      return arr;
    }, []);
  }

  private mountEndpointsToRouter(router: IDecorator<IRouter>) {
    router.params.router = new Router();
    this.loadMiddlewares(router.params, this._beforeMiddlewares);
    router.params.endpoints.map((endpoint) => {
      const beforeMiddlewares = this.getBeforeAfterMiddlewares(endpoint.middlewares, "BEFORE");
      const afterMiddlewares = this.getBeforeAfterMiddlewares(endpoint.middlewares, "AFTER");
      endpoint.functions = [
        ...beforeMiddlewares,
        ...endpoint.functions,
        ...afterMiddlewares
      ].map(HandlerFunctionHelper.getWrappedHandlerFunction);
      router.params.router[endpoint.method.toLowerCase()](
        `${endpoint.endpoint}`,
        ...endpoint.functions
      );
    });
    this.loadMiddlewares(router.params, this._afterMiddlewares);
  }

  private extractMiddlewares(arr: IDecorator<IUsedMiddleware>[]): MiddlewareType[] {
    return arr.reduce((prev, curr) => [
      ...prev,
      ...curr.params.middlewares
    ], []);
  }

  private addAsService(item: IDecorator<any>) {
    const instance = new (item.class as IClassType<any>)();
    const service = {
      ...item,
      params: {
        instance
      }
    };
    this.AddService(service);
    return instance;
  }
  //#endregion
}
