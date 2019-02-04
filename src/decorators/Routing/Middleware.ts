import { DecoratorStorage } from "@logic";
import { MiddlewareExecutionTime } from "@types";

export const Middleware = (executionTime?: MiddlewareExecutionTime): Function => {
  return (target: Function): void => {
    DecoratorStorage.Instance.AddMiddleware({
      class: target,
      key: target.name,
      params: {
        executionTime: executionTime || "BEFORE"
      }
    });
  };
};
