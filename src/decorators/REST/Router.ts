import { DecoratorStorage } from "@logic";
import { IRouterParams, MiddlewareType } from "@types";

export const Router = (path: string, middlewares?: MiddlewareType[]): Function => {
  return (target: Function): void => {
    DecoratorStorage.Instance.AddRouter({
      class: target,
      key: target.name,
      params: {
        path,
        middlewares: middlewares || [],
        endpoints: []
        // extends: params.extends,
      }
    });
  };
};
