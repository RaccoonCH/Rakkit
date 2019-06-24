import {
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLObjectType
} from "graphql";
import {
  ICreateParams,
  DecoratorHelper,
  GqlType,
  MetadataStorage,
  IField,
  ICustomTypeCreatorParams,
  IGqlType,
  IEnumTypeParams,
  IUnionTypeParams,
  IClassType,
  UnionFromClasses,
  ArrayElements
} from "../../..";

export class TypeCreator {
  /**
   * Create a Union Type from an existing enum (TS)
   * @param enumType The union type
   * @param params The type paramaters
   */
  static CreateEnum<EnumType extends Object>(
    enumType: EnumType,
    params?: IEnumTypeParams
  ) {
    const generatedName = Object.entries(enumType).reduce((prev, [key, value]) => {
      if (Number.isNaN(Number(key))) {
        return prev + key;
      }
      return prev;
    }, "");
    const definedParams = params || {};
    const definedName = definedParams.name || generatedName;
    const gqlTypeDef = this.createGqlTypeDef(
      definedName,
      GraphQLEnumType,
      {
        ...params,
        enumRef: enumType
      }
    );

    Object.entries(enumType).map(([key, value]) => {
      if (Number.isNaN(Number(key))) {
        MetadataStorage.Instance.Gql.AddField(
          DecoratorHelper.getAddFieldParams(
            gqlTypeDef.class,
            key,
            undefined,
            {
              enumValue: value
            }
          )
        );
      }
    });

    MetadataStorage.Instance.Gql.AddType(gqlTypeDef);

    // Musts return the class to resolve the type in the app
    return gqlTypeDef.class;
  }

  /**
   * Create a GraphQL UnionType from existing types (Equivalent to (TS): YourType1 | YourType2)
   * @param params The type parameters
   * @param types The types with which you will create the union
   */
  static CreateUnion<Type extends IClassType[]>(
    types: Type,
    params?: IUnionTypeParams
  ): UnionFromClasses<Type> {
    const definedParams: ICreateParams = params || {};

    const basicName = types.reduce((prev, classType) =>
      prev + classType.name
    , "");

    const gqlTypeDef = this.createGqlTypeDef(
      definedParams.name || `union${basicName}`,
      GraphQLUnionType,
      params
    );
    gqlTypeDef.params.unionTypes = types;

    MetadataStorage.Instance.Gql.AddType(gqlTypeDef);

    // Musts return the class to resolve the type in the app
    return gqlTypeDef.class as InstanceType<ArrayElements<Type>>;
  }

  /**
   * Create a Partial type from an another type (Equivalent to (TS): Partial<Type>)
   * @param target The target class
   * @param params The creation options
   */
  static CreateRequired<Type extends IClassType>(target: Type);
  static CreateRequired<Type extends IClassType>(target: Type, params: ICustomTypeCreatorParams);
  static CreateRequired<Type extends IClassType>(
    target: Type,
    params?: ICustomTypeCreatorParams
  ) {
    const definedParams = params || {};
    return this.createTransformation(
      target,
      "Required",
      { nullable: false },
      definedParams.gqlType,
      definedParams.name,
      { description: params.description }
    );
  }

  /**
   * Create a Required type from an another type (Equivalent to (TS): Required<Type>)
   * @param target The target class
   * @param params The creation options
   */
  static CreatePartial<Type extends IClassType>(target: Type);
  static CreatePartial<Type extends IClassType>(target: Type, params: ICustomTypeCreatorParams);
  static CreatePartial<Type extends IClassType>(
    target: Type,
    params?: ICustomTypeCreatorParams
  ) {
    const definedParams = params || {};
    return this.createTransformation(
      target,
      "Partial",
      { nullable: true },
      definedParams.gqlType,
      definedParams.name,
      { description: params.description }
    );
  }

  /**
   * Generic method to create transformed type
   */
  private static createTransformation<Type extends GqlType = typeof GraphQLObjectType>(
    target: Function,
    prefix: string,
    fieldsTransformation: Partial<IField>,
    gqlType?: Type,
    name?: string,
    rootTransformation?: Partial<IGqlType>
  ): Function {
    const gqlTypeDef = this.createGqlTypeDef(
      name || target.name,
      gqlType
    );
    gqlTypeDef.params.transformation = {
      prefix: name ? undefined : prefix,
      target,
      rootTransformation,
      fieldsTransformation: {
        params: fieldsTransformation
      }
    };
    MetadataStorage.Instance.Gql.AddType(gqlTypeDef);
    return gqlTypeDef.class;
  }

  /**
   * Create an artificial GqlTypeDef at runtime
   * @param name The gqlTypeDef name
   * @param gqlType The GraphQL Type
   */
  private static createGqlTypeDef<Type extends GqlType>(
    name: string,
    gqlType: Type,
    extraParams: Partial<IGqlType> = {}
  ) {
    return DecoratorHelper.getAddTypeParams<Type>(
      () => name,
      gqlType,
      name,
      extraParams
    );
  }
}
