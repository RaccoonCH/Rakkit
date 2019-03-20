import {
  MetadataStorage,
  HttpMethod,
  MiddlewareExecutionTime,
  GqlType
} from "../..";

export class DecoratorHelper {
  static getAddTypeDecorator(gqlTypeName: GqlType) {
    return () => {
      return (target: Function): void => {
        this.getAddTypeFunction(target, gqlTypeName);
      };
    };
  }

  static getAddTypeFunction(target: Function, gqlTypeName: GqlType, interfaces: Function[] = []) {
    const name = target.name;
    MetadataStorage.Instance.Gql.AddType({
      class: target,
      key: name,
      category: "gql",
      params: {
        interfaces,
        gqlTypeName,
        name
      }
    });
  }

  static getAddEndpointDecorator(method: HttpMethod) {
    return (endpoint?: string): Function => {
      return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
        MetadataStorage.Instance.Rest.AddEndpoint({
          class: target.constructor,
          key,
          category: "rest",
          params: {
            endpoint: endpoint || "/",
            method,
            functions: [descriptor.value]
          }
        });
      };
    };
  }

  static getAddMiddlewareDecorator(executionTime: MiddlewareExecutionTime) {
    return (): Function => {
      return (target: Function, key: string, descriptor: PropertyDescriptor): void => {
        const isClass = !key;
        const finalKey = isClass ? target.name : key;
        const finalFunc = isClass ? target : descriptor.value;
        MetadataStorage.Instance.Rest.AddMiddleware({
          class: finalFunc,
          key: finalKey,
          category: "rest",
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
