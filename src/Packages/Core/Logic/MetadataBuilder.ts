import {
  IDecorator,
  MetadataStorage
} from "../../..";

export abstract class MetadataBuilder {
  abstract Build(): void;

  protected extractParams<DecoratorType = any>(items: IDecorator<DecoratorType>[]) {
    return items.map((item) => item.params);
  }

  protected bindContext(context: IDecorator<any>, fn: Function): Function;
  protected bindContext(context: IDecorator<any>, fns: Function[]): Function[];
  protected bindContext(context: IDecorator<any>, fnsOrFn: Function[] | Function) : Function[] | Function {
    const service = MetadataStorage.Instance.Di.GetService(context);
    if (service) {
      const instance = service.params.instance;
      if (Array.isArray(fnsOrFn)) {
        return fnsOrFn.map(
          (fn) => fn.bind(instance)
        );
      }
      return fnsOrFn.bind(instance);
    }
    return fnsOrFn;
  }

  /**
   * Normalize the path of a router or an endpoint
   * @param path The path string (example: "/router")
   */
  protected normalizePath(path?: string) {
    let finalPath = path ? path.toLowerCase().trim() : "";
    if (finalPath[0] !== "/") {
      finalPath = `/${finalPath}`;
    }
    if (finalPath[finalPath.length - 1] === "/" && finalPath.length > 1) {
      finalPath = finalPath.substr(0, finalPath.length - 2);
    }
    return finalPath;
  }

  protected copyDecoratorType<DecoratorType>(
    decoratorType: IDecorator<DecoratorType>,
    changes?: Partial<IDecorator<Partial<DecoratorType>>>
  ): IDecorator<DecoratorType> {
    let definedChanges = changes;
    if (!definedChanges) {
      definedChanges = {};
      definedChanges.params = {};
    }
    return {
      ...decoratorType,
      ...(changes || {}),
      params: {
        ...decoratorType.params,
        ...definedChanges.params
      }
    };
  }
}
