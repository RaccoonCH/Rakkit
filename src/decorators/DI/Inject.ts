import { DecoratorStorage } from "../../logic";

export const Inject = (): Function => {
  return (target: Object, key: string): void => {
    const serviceType = Reflect.getMetadata("design:type", target, key);
    DecoratorStorage.Instance.AddInjection({
      class: target.constructor,
      key,
      params: {
        injectionType: (serviceType as Function)
      }
    });
  };
};
