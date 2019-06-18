// #region Imports
import "reflect-metadata";
import {
  graphql,
  IntrospectionQuery,
  getIntrospectionQuery,
  TypeKind,
  IntrospectionInterfaceType,
  IntrospectionObjectType,
  IntrospectionInputObjectType,
  IntrospectionNamedTypeRef,
  GraphQLID,
  IntrospectionListTypeRef,
  GraphQLInterfaceType
} from "graphql";
import {
  Rakkit,
  ObjectType,
  Field,
  InterfaceType,
  InputType,
  IClassType,
  ConcatName,
  MetadataStorage
} from "../../..";
import {
  SimpleObjectType,
  ObjectTypeForUnion,
  ScalarMap,
  SimpleEnumClassType,
  SimpleInputType,
  SimpleInterfaceType,
  ThreeTypes,
  enumFromTypeCreator,
  enumType,
  unionType
} from "./Utils/Classes";
// #endregion

describe("GraphQL", () => {
  afterEach(async () => {
    await Rakkit.stop();
  });

  describe("Field", () => {
    it("Should apply timestamp date mode", async () => {
      @ObjectType()
      class TimestampMode {
        @Field({
          nullable: true
        })
        date: Date;
      }

      await Rakkit.start({
        silent: true,
        gql: {
          dateMode: "timestamp"
        }
      });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "TimestampMode") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);

      expect(simpleType.fields[0].name).toBe("date");
      expect((simpleType.fields[0].type as IntrospectionNamedTypeRef).name).toBe("Timestamp");
    });

    it("Should create nullable fields", async () => {
      @ObjectType()
      class Nullable {
        @Field({
          nullable: true
        })
        a: String;

        @Field()
        b: Number;

        @Field({
          nullable: true
        })
        c: Number;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "Nullable") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);

      expect(simpleType.fields[0].name).toBe("a");
      expect(simpleType.fields[0].type.kind).not.toBe("NON_NULL");

      expect(simpleType.fields[1].name).toBe("b");
      expect(simpleType.fields[1].type.kind).toBe("NON_NULL");

      expect(simpleType.fields[2].name).toBe("c");
      expect(simpleType.fields[2].type.kind).not.toBe("NON_NULL");
    });

    it("Should create nullable fields with nullableByDefault", async () => {
      @ObjectType()
      class NullableWithNullableByDefault {
        @Field({
          nullable: false
        })
        a: String;

        @Field()
        b: Number;

        @Field({
          nullable: false
        })
        c: Number;
      }

      await Rakkit.start({
        gql: {
          nullableByDefault: true
        }
      });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "NullableWithNullableByDefault") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);

      expect(simpleType.fields[0].name).toBe("a");
      expect(simpleType.fields[0].type.kind).toBe("NON_NULL");

      expect(simpleType.fields[1].name).toBe("b");
      expect(simpleType.fields[1].type.kind).not.toBe("NON_NULL");

      expect(simpleType.fields[2].name).toBe("c");
      expect(simpleType.fields[2].type.kind).toBe("NON_NULL");
    });

    it("Should create a field with array type", async () => {
      @ObjectType()
      class ArrayDepthType {
        @Field(type => Number)
        simpleArrayField: number[];

        @Field(type => [Number])
        depthArrayField1: number[];

        @Field(type => [[Number]])
        depthArrayField2: number[][];

        @Field(type => [[Number]])
        depthArrayFieldResolver(): Number[][] {
          return [[1]];
        }
      }

      await Rakkit.start({
        gql: {
          nullableByDefault: true
        }
      });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "ArrayDepthType") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);

      expect(simpleType.fields[0].name).toBe("simpleArrayField");
      expect(simpleType.fields[0].type.kind).toBe("LIST");
      expect((simpleType.fields[0].type as any).ofType.name).toBe("Float");

      expect(simpleType.fields[1].name).toBe("depthArrayField1");
      expect(simpleType.fields[1].type.kind).toBe("LIST");
      expect((simpleType.fields[1].type as any).ofType.name).toBe("Float");

      expect(simpleType.fields[2].name).toBe("depthArrayField2");
      expect(simpleType.fields[2].type.kind).toBe("LIST");
      expect((simpleType.fields[2].type as any).ofType.kind).toBe("LIST");
      expect((simpleType.fields[2].type as any).ofType.ofType.name).toBe("Float");

      expect(simpleType.fields[3].name).toBe("depthArrayFieldResolver");
      expect(simpleType.fields[3].type.kind).toBe("LIST");
      expect((simpleType.fields[3].type as any).ofType.kind).toBe("LIST");
      expect((simpleType.fields[3].type as any).ofType.ofType.name).toBe("Float");
    });

    it("Should convert primitive type and scalarMap to GraphQL Type and apply params", async () => {
      @ObjectType()
      class PrimitiveType {
        @Field({
          description: "a str type",
          nullable: true
        })
        str: String;

        @Field({
          deprecationReason: "deprecated",
          description: "an int type",
          nullable: true
        })
        int: Number;

        @Field({
          nullable: true,
          name: "boolValue",
          description: "a bool type"
        })
        bool: Boolean;

        @Field({
          nullable: true,
          description: "a date type"
        })
        date: Date;

        @Field(type => String, {
          nullable: true,
          description: "an array of string type"
        })
        arrStr: String[];

        @Field({
          nullable: true,
          description: "a scalar type"
        })
        scalarMap: ScalarMap;
      }

      await Rakkit.start({
        gql: {
          scalarMap: [
            [ScalarMap, GraphQLID]
          ]
        }
      });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "PrimitiveType") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);

      expect(simpleType.fields[0].name).toBe("str");
      expect((simpleType.fields[0].type as IntrospectionNamedTypeRef).name).toBe("String");
      expect(simpleType.fields[0].description).toBe("a str type");

      expect(simpleType.fields[1].name).toBe("int");
      expect((simpleType.fields[1].type as IntrospectionNamedTypeRef).name).toBe("Float");
      expect(simpleType.fields[1].description).toBe("an int type");
      expect(simpleType.fields[1].deprecationReason).toBe("deprecated");

      expect(simpleType.fields[2].name).toBe("boolValue");
      expect((simpleType.fields[2].type as IntrospectionNamedTypeRef).name).toBe("Boolean");
      expect(simpleType.fields[2].description).toBe("a bool type");

      expect(simpleType.fields[3].name).toBe("date");
      expect((simpleType.fields[3].type as IntrospectionNamedTypeRef).name).toBe("DateTime");
      expect(simpleType.fields[3].description).toBe("a date type");

      expect(simpleType.fields[4].name).toBe("arrStr");
      expect(((simpleType.fields[4].type as IntrospectionListTypeRef).ofType as IntrospectionNamedTypeRef).name).toBe("String");
      expect((simpleType.fields[4].type as IntrospectionListTypeRef).kind).toBe("LIST");
      expect(simpleType.fields[4].description).toBe("an array of string type");

      expect(simpleType.fields[5].name).toBe("scalarMap");
      expect((simpleType.fields[5].type as IntrospectionNamedTypeRef).name).toBe("ID");
      expect(simpleType.fields[5].description).toBe("a scalar type");
    });

    it("ObjectType should make a relationship", async () => {
      @ObjectType()
      class ObjectTypeRelationship {
        @Field({
          nullable: true
        })
        toType: SimpleObjectType;

        @Field({
          nullable: true
        })
        toInterface: SimpleInterfaceType;

        @Field(type => enumFromTypeCreator, {
          nullable: true
        })
        toEnumTypeCreator: enumType;

        @Field({
          nullable: true
        })
        toEnumClass: SimpleEnumClassType;

        @Field(type => unionType, {
          nullable: true
        })
        toUnion: SimpleObjectType | ObjectTypeForUnion;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "ObjectTypeRelationship") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);

      expect(simpleType.fields[0].name).toBe("toType");
      expect((simpleType.fields[0].type as IntrospectionNamedTypeRef).name).toBe("SimpleType");

      expect(simpleType.fields[1].name).toBe("toInterface");
      expect((simpleType.fields[1].type as IntrospectionNamedTypeRef).name).toBe("SimpleInterface");

      expect(simpleType.fields[2].name).toBe("toEnumTypeCreator");
      expect((simpleType.fields[2].type as IntrospectionNamedTypeRef).name).toBe("SimpleEnumTypeCreator");

      expect(simpleType.fields[3].name).toBe("toEnumClass");
      expect((simpleType.fields[3].type as IntrospectionNamedTypeRef).name).toBe("SimpleEnumClass");

      expect(simpleType.fields[4].name).toBe("toUnion");
      expect((simpleType.fields[4].type as IntrospectionNamedTypeRef).name).toBe("UnionType");
    });

    it("InterfaceType should make a relationship", async () => {
      @InterfaceType()
      class InterfaceTypeRelationship {
        @Field({
          nullable: true
        })
        toType: SimpleObjectType;

        @Field({
          nullable: true
        })
        toInterface: SimpleInterfaceType;

        @Field(type => enumFromTypeCreator, {
          nullable: true
        })
        toEnumTypeCreator: enumType;

        @Field({
          nullable: true
        })
        toEnumClass: SimpleEnumClassType;

        @Field(type => unionType, {
          nullable: true
        })
        toUnion: SimpleObjectType | ObjectTypeForUnion;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InterfaceTypeRelationship") as IntrospectionInterfaceType;

      expect(simpleType.kind).toBe(TypeKind.INTERFACE);

      expect(simpleType.fields[0].name).toBe("toType");
      expect((simpleType.fields[0].type as IntrospectionNamedTypeRef).name).toBe("SimpleType");

      expect(simpleType.fields[1].name).toBe("toInterface");
      expect((simpleType.fields[1].type as IntrospectionNamedTypeRef).name).toBe("SimpleInterface");

      expect(simpleType.fields[2].name).toBe("toEnumTypeCreator");
      expect((simpleType.fields[2].type as IntrospectionNamedTypeRef).name).toBe("SimpleEnumTypeCreator");

      expect(simpleType.fields[3].name).toBe("toEnumClass");
      expect((simpleType.fields[3].type as IntrospectionNamedTypeRef).name).toBe("SimpleEnumClass");

      expect(simpleType.fields[4].name).toBe("toUnion");
      expect((simpleType.fields[4].type as IntrospectionNamedTypeRef).name).toBe("UnionType");
    });

    it("InputType should make a relationship", async () => {
      @InputType()
      class InputTypeRelationship {
        @Field({
          nullable: true
        })
        toInput: SimpleInputType;

        @Field(type => enumFromTypeCreator, {
          nullable: true
        })
        toEnumTypeCreator: enumType;

        @Field({
          nullable: true
        })
        toEnumClass: SimpleEnumClassType;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InputTypeRelationship") as IntrospectionInputObjectType;

      expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);

      expect(simpleType.inputFields[0].name).toBe("toInput");
      expect((simpleType.inputFields[0].type as IntrospectionNamedTypeRef).name).toBe("SimpleInput");

      expect(simpleType.inputFields[1].name).toBe("toEnumTypeCreator");
      expect((simpleType.inputFields[1].type as IntrospectionNamedTypeRef).name).toBe("SimpleEnumTypeCreator");

      expect(simpleType.inputFields[2].name).toBe("toEnumClass");
      expect((simpleType.inputFields[2].type as IntrospectionNamedTypeRef).name).toBe("SimpleEnumClass");
    });

    it("InputType should make a relationship to InputType with a class with multiple gqlType", async () => {
      @InputType()
      class InputTypeRelationshipMultiple {
        @Field({
          nullable: true
        })
        toInput: ThreeTypes;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InputTypeRelationshipMultiple") as IntrospectionInputObjectType;

      expect((simpleType.inputFields[0].type as IntrospectionNamedTypeRef).name).toBe("GraphQLInputObjectTypeThreeTypes");
    });

    it("ObjectType should make a relationship to ObjectType with a class with multiple gqlType", async () => {
      @ObjectType()
      class ObjectTypeRelationshipMultiple {
        @Field({
          nullable: true
        })
        toType: ThreeTypes;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "ObjectTypeRelationshipMultiple") as IntrospectionObjectType;

      expect((simpleType.fields[0].type as IntrospectionNamedTypeRef).name).toBe("GraphQLObjectTypeThreeTypes");
    });

    it("InterfaceType should make a relationship to ObjectType with a class with multiple gqlType", async () => {
      @InterfaceType()
      class InterfaceTypeRelationshipMultiple {
        @Field({
          nullable: true
        })
        toInterface: ThreeTypes;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InterfaceTypeRelationshipMultiple") as IntrospectionInterfaceType;

      expect((simpleType.fields[0].type as IntrospectionNamedTypeRef).name).toBe("GraphQLObjectTypeThreeTypes");
    });

    it("InterfaceType should make a relationship to InterfaceType (by forcing it) with a class with multiple gqlType", async () => {
      @InterfaceType()
      class InterfaceTypeRelationshipMultipleForced {
        @Field({
          nullable: true,
          gqlType: GraphQLInterfaceType
        })
        toInterface: ThreeTypes;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      // tslint:disable-next-line:max-line-length
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InterfaceTypeRelationshipMultipleForced") as IntrospectionInterfaceType;

      expect((simpleType.fields[0].type as IntrospectionNamedTypeRef).name).toBe("GraphQLInterfaceTypeThreeTypes");
    });

    it("Should create a generic type", async () => {
      @ObjectType()
      class GenericElement {
        @Field()
        hello: string;
      }

      @ObjectType()
      class Response<Type, Type2> implements SimpleInterfaceType {
        @Field()
        interfaceField: number;
        items?: Type[];
        items2: Type2;
      }

      function getItems<Type, Type2>(
        itemsType: IClassType<Type>,
        itemsType2: IClassType<Type2>
      ): IClassType<Response<Type, Type2>> {
        @ConcatName(itemsType)
        @ObjectType()
        class GenericResponse extends Response<Type, Type2> {
          @Field(type => itemsType, {
            nullable: true,
            description: "items"
          })
          items: Type[];

          @Field(type => itemsType2)
          items2: Type2;
        }
        return GenericResponse as any;
      }

      getItems(SimpleObjectType, SimpleObjectType);
      getItems(GenericElement, SimpleObjectType);

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "GenericResponseSimpleType") as IntrospectionObjectType;
      const simpleType2 = schema.types.find((schemaType) => schemaType.name === "GenericResponseGenericElement") as IntrospectionObjectType;

      expect((simpleType.fields[0].type as any).kind).toBe("LIST");
      expect((simpleType.fields[0].type as any).ofType.name).toBe("SimpleType");
      expect((simpleType.fields[1].type as any).ofType.name).toBe("SimpleType");

      expect((simpleType2.fields[0].type as any).kind).toBe("LIST");
      expect((simpleType2.fields[0].type as any).ofType.name).toBe("GenericElement");
      expect((simpleType2.fields[1].type as any).ofType.name).toBe("SimpleType");
    });
  });
});
