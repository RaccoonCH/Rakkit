import * as Router from "koa-router";
import { AppLoader, HandlerFunctionHelper } from "@logic";
import {
  IDecorator,
  IPackage,
  IAttribute,
  IRouter,
  IEndpoint,
  HttpMethod,
  MiddlewareType,
  IMiddleware,
  MiddlewareExecutionTime,
  IOn,
  HandlerFunction,
  IMiddlewareClass
} from "@types";
import { Main } from "@main";
import { Middleware } from "koa";

export class DecoratorStorage {
  private static _instance: DecoratorStorage;
  private _packages: Map<Object, IDecorator<IPackage>> = new Map();
  private _attributes: IDecorator<IAttribute>[] = [];
  private _routers: Map<Object, IDecorator<IRouter>> = new Map();
  private _endpoints: IDecorator<IEndpoint>[] = [];
  private _middlewares: Map<Object, IDecorator<IMiddleware>> = new Map();
  private _beforeMiddlewares: Map<Object, HandlerFunction> = new Map();
  private _afterMiddlewares: Map<Object, HandlerFunction> = new Map();
  private _compiledPackages: IPackage[];
  private _compiledRouter: Router = new Router();
  private _ons: IOn[] = [];

  static get Instance() {
    if (!this._instance) {
      this._instance = new DecoratorStorage();
    }
    return this._instance;
  }

  get Packages() {
    return this._compiledPackages as ReadonlyArray<IPackage>;
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
    return this._ons as ReadonlyArray<IOn>;
  }

  get Endpoints() {
    return this._endpoints as ReadonlyArray<IDecorator<IEndpoint>>;
  }

  static getAddEndPointDecorator(method: HttpMethod) {
    return (endpoint: string, middlewares?: MiddlewareType[]): Function => {
      return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
        this.Instance.AddEndpoint({
          class: target.constructor,
          key,
          params: {
            endpoint,
            method,
            functions: [descriptor.value],
            middlewares: middlewares || []
          }
        });
      };
    };
  }

  static getAddMiddlewareDecorator(executionTime: MiddlewareExecutionTime) {
    return (): Function => {
      return (target: Function, key: string, descriptor: PropertyDescriptor): void => {
        const finalKey = key || target.name;
        let finalClass = target;
        let func;
        if (key && descriptor) {
          func = descriptor.value;
          finalClass = func;
        } else {
          const ItemClass: IMiddlewareClass = target as IMiddlewareClass;
          const instance = new ItemClass();
          func = instance.use;
        }
        this.Instance.AddMiddleware({
          class: finalClass,
          key: finalKey,
          params: {
            executionTime,
            function: func
          }
        });
      };
    };
  }

  AddAttribute(item: IDecorator<IAttribute>) {
    this._attributes.push(item);
  }

  AddPackage(item: IDecorator<IPackage>) {
    this._packages.set(item.class, item);
  }

  AddRouter(item: IDecorator<IRouter>) {
    this._routers.set(item.class, item);
  }

  AddEndpoint(item: IDecorator<IEndpoint>) {
    this._endpoints.push(item);
  }

  AddOn(item: IDecorator<IOn>) {
    this._ons.push(item.params);
  }

  AddMiddleware(item: IDecorator<IMiddleware>) {
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

  async BuildAll() {
    this.buildPackages();
    this.buildRouters();
  }

  private async buildPackages() {
    this._attributes.map((item) => {
      const packageItem = this._packages.get(item.class);
      packageItem.params.attributes.push(item.params);
    });
    this._compiledPackages = this.compile(this._packages);
  }

  private async buildRouters() {
    this._endpoints.map((item) => {
      const router = this._routers.get(item.class);
      const alreadyMerged = router.params.endpoints.find(
        endpoint => endpoint.functions.indexOf(item.params.functions[0]) > -1
      );
      if (!alreadyMerged) {
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
        item.params.functions = mergedFunctions;
        router.params.endpoints.push(item.params);
      }
    });
    const routers = Array.from(this._routers.values());
    routers.map((item) => {
      this.mountEndpointsToRouter(item);
      this._compiledRouter.use(
        `/${item.params.path}`,
        item.params.router.routes(),
        item.params.router.allowedMethods()
      );
    });
  }

  private loadMiddlewares(router: IRouter, middlewares: Map<Object, HandlerFunction>) {
    AppLoader.loadMiddlewares(
      router.middlewares,
      router.router,
      middlewares
    );
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

  private compile(map: Map<Object, IDecorator<any>>) {
    return Array.from(map.values()).map((item) => {
      return item.params;
    });
  }
}