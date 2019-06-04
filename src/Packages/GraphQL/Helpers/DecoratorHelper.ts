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
  IGqlObjectParams
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

  static getTypeInfos(typeFn: TypeFn, reflectTypeFn: TypeFn) {
    let arrayDepth = 0;
    let finalTypeFn: TypeFn = undefined;


    const countArrayDepth = (prev: Array<Function> | Function) => {
      if (Array.isArray(prev)) {
        arrayDepth++;
        countArrayDepth(prev[0]);
      } else {
        finalTypeFn = () => prev;
      }
    };

    if (typeFn) {
      const theType = typeFn();
      if (theType) {
        countArrayDepth(theType);
      }
    }

    if (this.returnAnArray(reflectTypeFn) && arrayDepth === 0) {
      arrayDepth = 1;
    }

    return {
      arrayDepth,
      type: finalTypeFn || reflectTypeFn
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
        args: [],
        function: undefined,
        type: typeFn,
        deprecationReason: undefined,
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

  static getAddFieldDecorator(
    typeOrParams?: ISubscriptionParams | IFieldParams | TypeFn,
    params?: ISubscriptionParams | IFieldParams,
    resolveType?: GqlResolveType
  ) {
    return (target: Object, key: string, descriptor?: PropertyDescriptor): void => {
      const isType = typeof typeOrParams === "function";
      const definedType = isType ? typeOrParams as TypeFn : undefined;
      const definedParams: Partial<IField> = (isType ? params : typeOrParams as Partial<IField>) || {};
      let reflectType: TypeFn = () => Reflect.getMetadata("design:type", target, key);

      if (descriptor) {
        definedParams.function = descriptor.value;
        reflectType = () => Reflect.getMetadata("design:returntype", target, key);
      }

      const typeInfos = DecoratorHelper.getTypeInfos(definedType, reflectType);
      definedParams.arrayDepth = typeInfos.arrayDepth;
      definedParams.resolveType = resolveType;

      MetadataStorage.Instance.Gql.AddField(
        DecoratorHelper.getAddFieldParams(
          target.constructor,
          key,
          typeInfos.type,
          definedParams
        )
      );
    };
  }

  static returnAnArray(type: TypeFn) {
    if (type) {
      const definedType = type();
      if (definedType) {
        return Array.isArray(definedType.prototype);
      }
    }
    return false;
  }
}
