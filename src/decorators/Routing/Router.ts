import { DecoratorStorage } from "@logic";

export const Router = (path: string): Function => {
  return (target: Function): void => {
    DecoratorStorage.Instance.AddRouter({
      class: target,
      key: target.name,
      params: {
        path,
        endpoints: []
      }
    });
  };
};
