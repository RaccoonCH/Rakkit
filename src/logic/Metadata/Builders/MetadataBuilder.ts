import {
  IDecorator,
  MetadataStorage
} from "../../..";

export abstract class MetadataBuilder {
  abstract Build(): void;

  protected bindContext(context: IDecorator<any>, fn: Function): Function;
  protected bindContext(context: IDecorator<any>, fns: Function[]): Function[];
  protected bindContext(context: IDecorator<any>, fnsOrFn: Function[] | Function) : Function[] | Function {
    const instance = MetadataStorage.Instance.Di.GetService(context).params.instance;
    if (Array.isArray(fnsOrFn)) {
      return fnsOrFn.map(
        (fn) => fn.bind(instance)
      );
    }
    return fnsOrFn.bind(instance);
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
}
