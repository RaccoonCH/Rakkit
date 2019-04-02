import {
  GraphQLEnumValueConfigMap,
  GraphQLEnumType,
  GraphQLUnionType
} from "graphql";
import {
  ICreateParams,
  DecoratorHelper,
  GqlType,
  MetadataStorage
} from "../../..";

export class TypeCreator {
  /**
   * Create a Union Type from an existing enum (TS)
   * @param enumType The union type
   * @param params The type paramaters
   */
  static CreateEnum<EnumType extends Object>(
    enumType: EnumType,
    params?: ICreateParams
  ) {
    const values: GraphQLEnumValueConfigMap = {};
    const generatedName = Object.entries(enumType).reduce((prev, [key, value]) => {
      values[key] = {
        value
      };
      return prev + key;
    }, "");
    const definedParams = params || {};
    const definedName = definedParams.name || generatedName;
    const gqlTypeDef = this.createGqlTypeDef(
      definedName,
      GraphQLEnumType
    );
    gqlTypeDef.params.enumValues = values;

    MetadataStorage.Instance.Gql.AddType(gqlTypeDef);

    // Musts return the class to resolve the type in the app
    return gqlTypeDef.class;
  }

  /**
   * Create a GraphQL UnionType from existing types (Equivalent to (TS): YourType1 | YourType2)
   * @param params The type parameters
   * @param types The types with which you will create the union
   */
  static CreateUnion(params: ICreateParams, ...types: Function[]);
  static CreateUnion(types: Function[]);
  static CreateUnion(paramsOrTypes?: ICreateParams | Function[], ...types: Function[]) {
    const isTypes = Array.isArray(paramsOrTypes);
    const definedParams: ICreateParams = isTypes ? {} : paramsOrTypes as ICreateParams;
    const definedTypes = isTypes ? paramsOrTypes as Function[] : types;
    const basicName = definedTypes.reduce((prev, classType) =>
      prev + classType.name
    , "");

    const gqlTypeDef = this.createGqlTypeDef(
      definedParams.name || `union${basicName}`,
      GraphQLUnionType
    );
    gqlTypeDef.params.unionTypes = definedTypes;

    MetadataStorage.Instance.Gql.AddType(gqlTypeDef);

    // Musts return the class to resolve the type in the app
    return gqlTypeDef.class;
  }

  /**
   * Create a GraphQL partial type from an existing type (Equivalent to (TS): Partial<YourType>)
   * @param classType
   */
  // WIP (remove private when done)
  // private CreatePartial(classType: Function): Function[];
  // private CreatePartial(classType: Function, gqlType: GqlType, name?: string): Function;
  // private CreatePartial(
  //   classType: Function,
  //   gqlType?: GqlType,
  //   name?: string
  // ): Function[] | Function {
  //   const targetTypes = this.GetGqlTypeDefs(classType, gqlType);
  //   const newTypes = targetTypes.map((targetType) => {
  //     const partialName = name || `Partial${targetType.params.name}`;
  //     const newType = DecoratorHelper.getAddTypeParams(
  //       () => name,
  //       targetType.params.gqlType,
  //       partialName,
  //       targetType.params.interfaces
  //     );
  //     this.copyFieldsWithTransformation(
  //       targetType,
  //       newType,
  //       { nullable: true }
  //     );
  //     this.AddType(newType);
  //     return newType;
  //   });
  //   if (gqlType) {
  //     return newTypes[0].class;
  //   }
  //   return newTypes.map((newType) => newType.class);
  // }

  /**
   * Create an artificial GqlTypeDef at runtime
   * @param name The gqlTypeDef name
   * @param gqlType The GraphQL Type
   */
  private static createGqlTypeDef<Type extends GqlType>(
    name: string,
    gqlType: Type
  ) {
    return DecoratorHelper.getAddTypeParams<Type>(
      () => name,
      gqlType,
      name,
      []
    );
  }
}
