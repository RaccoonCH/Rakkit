import { DecoratorStorage } from "@logic";

export const Get = (endpoint: string): Function => {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    DecoratorStorage.Instance.AddEndpoint({
      class: target.constructor,
      key,
      params: {
        functions: [descriptor.value],
        endpoint,
        method: "GET"
      }
    });
  };
};
