import { DecoratorStorage } from "@logic";
import { IRouterParams } from "@types";

export const Router = (path: string, params: IRouterParams = {}): Function => {
  return (target: Function): void => {
    DecoratorStorage.Instance.AddRouter({
      class: target,
      key: target.name,
      params: {
        path,
        middlewares: params.middlewares || [],
        endpoints: []
        // extends: params.extends,
      }
    });
  };
};
