import {
  MetadataStorage,
  GqlType,
  IDecorator,
  IGqlType,
  TypeFn,
  GqlResolveType,
  IField,
  IFieldParams,
  ISubscriptionParams,
  IGqlObjectParams,
  Rakkit
} from "../../..";

export class DecoratorHelper {
  static getAddTypeDecorator(
    gqlType: GqlType,
    nameOrParams?: string | IGqlObjectParams,
    params?: IGqlObjectParams
  ) {
    const isName = typeof nameOrParams === "string";
    const definedName = isName ? nameOrParams as string : undefined;
    const definedParams: Partial<IGqlObjectParams> = (isName ? params : nameOrParams as IGqlObjectParams) || {};
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
        isArray: this.returnAnArray(typeFn),
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
    if (params.implements && !Array.isArray(params.implements)) {
      params.implements = [params.implements];
    }
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
    typeOrParams?: ISubscriptionParams | IFieldParams | TypeFn,
    params?: ISubscriptionParams | IFieldParams,
    resolveType: GqlResolveType = "Query"
  ) {
    const isType = typeof typeOrParams === "function";
    return (target: Object, key: string, descriptor: PropertyDescriptor): void => {
      const baseType = () => Reflect.getMetadata("design:returntype", target, key);
      const definedParams: Partial<ISubscriptionParams> = (isType ? params : typeOrParams as ISubscriptionParams) || {};
      const definedType = isType ? typeOrParams as TypeFn : baseType;
      const fieldDef = this.getAddFieldParams(
        target.constructor,
        key,
        definedType,
        {
          ...definedParams,
          resolveType,
          function: descriptor.value,
          name: typeOrParams.name || key,
          args: []
        }
      );
      MetadataStorage.Instance.Gql.AddField(fieldDef);
    };
  }

  static returnAnArray(type: TypeFn) {
    return Array.isArray(type().prototype);
  }
}
