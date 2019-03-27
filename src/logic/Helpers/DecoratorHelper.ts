import {
  MetadataStorage,
  HttpMethod,
  MiddlewareExecutionTime,
  GqlType,
  IDecorator,
  IGqlType,
  TypeFn,
  GqlResolveType,
  IField
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

  static getAddFieldParams(
    target: Function,
    key: string,
    typeFn: TypeFn,
    isArray: boolean,
    extraParams?: Partial<IField>
  ): IDecorator<IField> {
    const definedParams = extraParams || {};
    return {
      class: target,
      key,
      category: "gql",
      params: {
        resolveType: undefined,
        name: definedParams.name || key,
        args: undefined,
        function: undefined,
        partial: false,
        required: false,
        type: typeFn,
        deprecationReason: undefined,
        nullable: false,
        isArray,
        ...definedParams
      }
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
      key: target.name || definedName,
      category: "gql",
      params: {
        interfaces,
        gqlTypeName,
        name: definedName
      }
    };
  }

  static getAddResolveDecorator(
    typeOrName?: string | TypeFn,
    name?: string,
    resolveType: GqlResolveType = "Query"
  ) {
    const isType = typeof typeOrName === "function";
    return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
      const baseType = () => Reflect.getMetadata("design:returntype", target, key);
      const definedName = (isType ? name : typeOrName as string) || key;
      const definedType = isType ? typeOrName as TypeFn : baseType;
      MetadataStorage.Instance.Gql.AddField({
        class: target.constructor,
        key,
        category: "gql",
        params: {
          resolveType,
          name: definedName,
          args: [],
          partial: false,
          required: false,
          function: descriptor.value,
          deprecationReason: undefined,
          type: definedType,
          isArray: false,
          nullable: false
        }
      });
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
