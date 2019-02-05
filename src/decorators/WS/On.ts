import { DecoratorStorage } from "@logic";

export const On = (message: "connection" | string): Function => {
  return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
    DecoratorStorage.Instance.AddOn({
      class: target,
      key,
      params: {
        message,
        function: descriptor.value
      }
    });
  };
};
