import {
  IDecorator,
  IPackage,
  IAttribute,
  IRouter,
  IMiddleware,
  IEndpoint
} from "@types";
import { RequestHandlerParams } from "express-serve-static-core";

export class DecoratorStorage {
  private static _instance: DecoratorStorage;
  private _packages: Map<Function, IDecorator<IPackage>> = new Map();
  private _attributes: IDecorator<IAttribute>[] = [];
  private _routers: Map<Function, IDecorator<IRouter>> = new Map();
  private _endpoints: IDecorator<IEndpoint>[] = [];
  private _middlewares: IDecorator<IMiddleware>[];

  private _compiledPackages: IPackage[];
  private _compiledRouters: IRouter[];

  static get Instance() {
    if (!this._instance) {
      this._instance = new DecoratorStorage();
    }
    return this._instance;
  }

  get Packages() {
    return this._compiledPackages;
  }

  get Routers() {
    return this._compiledRouters;
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

  AddMiddleware(item: IDecorator<IMiddleware>) {
    this._middlewares.push(item);
  }

  AddEndpoint(item: IDecorator<IEndpoint>) {
    this._endpoints.push(item);
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
    this._compiledRouters = this.compile(this._routers);
  }

  private compile(map: Map<Function, IDecorator<any>>) {
    return Array.from(map.values()).map((item) => {
      return item.params;
    });
  }
}
