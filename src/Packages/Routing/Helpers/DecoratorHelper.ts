import {
  MetadataStorage,
  MiddlewareExecutionTime
} from "../../..";

export class DecoratorHelper {
  static getAddMiddlewareDecorator(executionTime: MiddlewareExecutionTime) {
    return (): Function => {
      return (target: Function, key: string, descriptor: PropertyDescriptor): void => {
        const isClass = !key;
        const finalKey = isClass ? target.name : key;
        const finalFunc = isClass ? target : descriptor.value;
        MetadataStorage.Instance.Routing.AddMiddleware({
          originalClass: finalFunc,
          class: finalFunc,
          key: finalKey,
          category: "routing",
          params: {
            executionTime,
            function: finalFunc,
            isClass
          }
        });
      };
    };
  }
}
