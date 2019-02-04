import {
  IDecorator,
  IPackage,
  IAttribute,
  IRouter,
  IEndpoint,
  HttpMethod,
  MiddlewareType,
  IMiddleware,
  BaseMiddleware
} from "@types";
import { RequestHandlerParams } from "express-serve-static-core";
import { Router } from "express";

export class DecoratorStorage {
  private static _instance: DecoratorStorage;
  private _packages: Map<Object, IDecorator<IPackage>> = new Map();
  private _attributes: IDecorator<IAttribute>[] = [];
  private _routers: Map<Object, IDecorator<IRouter>> = new Map();
  private _endpoints: IDecorator<IEndpoint>[] = [];
  private _middlewares: Map<Object, IDecorator<IMiddleware>> = new Map();
  private _compiledPackages: IPackage[];
  private _compiledRouter: Router = Router();

  static get Instance() {
    if (!this._instance) {
      this._instance = new DecoratorStorage();
    }
    return this._instance;
  }

  get Packages() {
    return this._compiledPackages;
  }

  get MainRouter() {
    return this._compiledRouter;
  }

  static getAddEndPointDecorator(method: HttpMethod) {
    return (endpoint: string, middlewares?: MiddlewareType[]): Function => {
      return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
        DecoratorStorage.Instance.AddEndpoint({
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

  AddMiddleware(item: IDecorator<IMiddleware>) {
    if (Object.getPrototypeOf(item.class) === BaseMiddleware) {
      this._middlewares.set(item.class, item);
    } else {
      throw new Error(`${item.key} do not extends ${BaseMiddleware.name} class`);
    }
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
        const mergedFunctions: RequestHandlerParams[] = [
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
      this._compiledRouter.use(item.params.router);
    });

    // EXTENDS FEATURE
    // routers
    //   .sort((a, b) => {
    //     return !!a.params.extends && !!b.params.extends ? 1 : -1;
    //   })
    //   .map((item) => {
    //     this.mountEndpointsToRouter(item);
    //     if (item.params.extends) {
    //       const routerToFind = item.params.extends;
    //       const foundRouter = this._routers.get(routerToFind);
    //       if (foundRouter) {
    //         foundRouter.params.router.use(`/${item.params.path}`, item.params.router);
    //       } else {
    //         throw new Error(
    //           `The Router from the class: ${item.class.name} cannot extends ${routerToFind.constructor.name}
    //            because it is not declared as a Router`
    //         );
    //       }
    //     }
    // });
  }

  private mountEndpointsToRouter(router: IDecorator<IRouter>) {
    router.params.router = Router();
    router.params.endpoints.map((endpoint) => {
      router.params.router[endpoint.method.toLowerCase()](
        `/${router.params.path}${endpoint.endpoint}`,
        ...endpoint.functions
      );
    });
  }

  private compile(map: Map<Object, IDecorator<any>>) {
    return Array.from(map.values()).map((item) => {
      return item.params;
    });
  }
}
