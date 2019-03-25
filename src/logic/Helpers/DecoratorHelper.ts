import {
  MetadataStorage,
  HttpMethod,
  MiddlewareExecutionTime,
  GqlType,
  IDecorator,
  IGqlType
} from "../..";

export class DecoratorHelper {
  static getAddTypeDecorator(gqlTypeName: GqlType) {
    return (name?: string) => {
      return (target: Function): void => {
        MetadataStorage.Instance.Gql.AddType(
          this.getAddTypeParams(target, gqlTypeName, name)
        );
      };
    };
  }

  static getAddTypeParams(
    target: Function,
    gqlTypeName: GqlType,
    name?: string,
    interfaces: Function[] = []
  ): IDecorator<IGqlType> {
    const definedName = name || target.name;
    return {
      class: target,
      key: target.name,
      category: "gql",
      params: {
        interfaces,
        gqlTypeName,
        name: definedName
      }
    };
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
        MetadataStorage.Instance.Routing.AddMiddleware({
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
