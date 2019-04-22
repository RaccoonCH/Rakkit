import {
  MetadataStorage,
  GqlType,
  IDecorator,
  IGqlType,
  TypeFn,
  GqlResolveType,
  IField
} from "../../..";

export class DecoratorHelper {
  static getAddTypeDecorator<ParamType extends object>(
    gqlType: GqlType,
    nameOrParams?: string | ParamType,
    params?: ParamType
  ) {
    const isName = typeof nameOrParams === "string";
    const definedName = isName ? nameOrParams as string : undefined;
    const definedParams = (isName ? params : nameOrParams) || {};
    return (target: Function): void => {
      MetadataStorage.Instance.Gql.AddType(
        DecoratorHelper.getAddTypeParams(target, gqlType, definedName, definedParams)
      );
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
      originalClass: target,
      class: target,
      key,
      category: "gql",
      params: {
        resolveType: undefined,
        name: definedParams.name || key,
        args: undefined,
        function: undefined,
        type: typeFn,
        deprecationReason: undefined,
        nullable: false,
        isArray,
        ...definedParams
      }
    };
  }

  static getAddTypeParams<Type extends GqlType>(
    target: Function,
    gqlType: Type,
    name?: string,
    params: Partial<IGqlType> = {}
  ): IDecorator<IGqlType<Type>> {
    const definedName = name || target.name;
    return {
      originalClass: target,
      class: target,
      key: target.name || definedName,
      category: "gql",
      params: {
        gqlType,
        name: definedName,
        implements: [],
        ...params
      }
    };
  }

  static getAddResolveDecorator(
    typeOrName?: string | TypeFn,
    name?: string,
    subscriptionTopics?: string[],
    resolveType: GqlResolveType = "Query"
  ) {
    const isType = typeof typeOrName === "function";
    return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
      const baseType = () => Reflect.getMetadata("design:returntype", target, key);
      const definedName = (isType ? name : typeOrName as string) || key;
      const definedType = isType ? typeOrName as TypeFn : baseType;
      MetadataStorage.Instance.Gql.AddField({
        originalClass: target.constructor,
        class: target.constructor,
        key,
        category: "gql",
        params: {
          subscriptionTopics,
          resolveType,
          name: definedName,
          args: [],
          function: descriptor.value,
          deprecationReason: undefined,
          type: definedType,
          isArray: false,
          nullable: false
        }
      });
    };
  }
}
