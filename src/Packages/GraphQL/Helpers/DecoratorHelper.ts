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
    interfaces: Function[] = []
  ): IDecorator<IGqlType<Type>> {
    const definedName = name || target.name;
    return {
      originalClass: target,
      class: target,
      key: target.name || definedName,
      category: "gql",
      params: {
        interfaces,
        gqlType,
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
        originalClass: target.constructor,
        class: target.constructor,
        key,
        category: "gql",
        params: {
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
