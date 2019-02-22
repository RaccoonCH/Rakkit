import { MetadataStorage } from "../../logic";

/**
 * Use it to inject a service instance (singleton), to the variable.
 */
export const Inject = (): Function => {
  return (target: Object, key: string): void => {
    const serviceType = Reflect.getMetadata("design:type", target, key);
    MetadataStorage.Instance.AddInjection({
      class: target.constructor,
      key,
      params: {
        injectionType: (serviceType as Function)
      }
    });
  };
};
