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
  IntrospectionEnumType,
  IntrospectionUnionType,
  GraphQLScalarType
} from "graphql";
import {
  Rakkit,
  ObjectType,
  Field,
  InterfaceType,
  InputType,
  TypeCreator
} from "../../..";
import {
  SimpleObjectType,
  SimpleInputType,
  SimpleInterfaceType
} from "./Utils/Classes";
import { MetadataStorage } from "../../Core/Logic/MetadataStorage";
// #endregion

describe("GraphQL", () => {
  afterEach(async () => {
    await Rakkit.stop();
  });

  describe("Simple type definition", () => {
    it("Should create an InterfaceType", async () => {
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleInterface") as IntrospectionInterfaceType;

      expect(simpleType.kind).toBe(TypeKind.INTERFACE);
      expect(simpleType.description).toBe("a simple interface");

      expect(simpleType.fields[0].name).toBe("interfaceField");
      expect(simpleType.fields[0].deprecationReason).toBe("deprecated");
      expect(simpleType.fields[0].description).toBe("an interface field");
    });

    it("Should create an ObjectType", async () => {
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleType") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);
      expect(simpleType.description).toBe("a simple type");
      expect(simpleType.fields.map((field) => field.name)).toEqual(["field", "interfaceField"]);
      expect(simpleType.interfaces[0].name).toBe("SimpleInterface");

      expect(simpleType.fields[0].deprecationReason).toBe("deprecated");
      expect(simpleType.fields[0].description).toBe("an object field");

      expect(simpleType.fields[1].deprecationReason).toBe("deprecated");
      expect(simpleType.fields[1].description).toBe("an interface field");
    });

    it("Should create an InputType", async () => {
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleInput") as IntrospectionInputObjectType;

      expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);
      expect(simpleType.description).toBe("a simple input");

      expect(simpleType.inputFields[0].name).toBe("inputField");
      expect(simpleType.inputFields[0].defaultValue).toBe("\"123\"");
      expect(simpleType.inputFields[0].description).toBe("an input field");
    });

    it("Should create an EnumType from class", async () => {
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleEnumClass") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.description).toBe("a simple enum from class");

      expect(simpleType.enumValues[0].name).toBe("enumField");
      expect(simpleType.enumValues[0].deprecationReason).toBe("deprecated");
      expect(simpleType.enumValues[0].description).toBe("enum field description");
    });

    it("Should create an EnumType from TypeCreator", async () => {
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleEnumTypeCreator") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.description).toBe("a simple enum from TypeCreator");

      expect(simpleType.enumValues[0].name).toBe("a");
    });

    it("Should create an UnionType", async () => {
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "UnionType") as IntrospectionUnionType;

      expect(simpleType.kind).toBe(TypeKind.UNION);
      expect(simpleType.description).toBe("an union type");
      expect(simpleType.possibleTypes.map((possibleType) => possibleType.name)).toEqual(["SimpleType", "ObjectTypeForUnion"]);
    });

    it("Should create a PartialType of ObjectType", async () => {
      const partialType = TypeCreator.CreatePartial(SimpleObjectType, {
        name: "MyPartialSimpleObjectType",
        description: "an object partial type"
      });
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "MyPartialSimpleObjectType") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);
      expect(simpleType.description).toBe("an object partial type");

      expect(simpleType.fields.length).toEqual(2);
      expect(simpleType.fields[0].type.kind).not.toBe("NON_NULL");
      expect(simpleType.fields[1].type.kind).not.toBe("NON_NULL");
    });

    it("Should create a PartialType of InputType", async () => {
      const partialType = TypeCreator.CreatePartial(SimpleInputType, {
        name: "MyPartialSimpleInputType",
        description: "an input partial type"
      });
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "MyPartialSimpleInputType") as IntrospectionInputObjectType;

      expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);
      expect(simpleType.description).toBe("an input partial type");

      expect(simpleType.inputFields.length).toEqual(1);
      expect(simpleType.inputFields[0].type.kind).not.toBe("NON_NULL");
    });

    it("Should create a PartialType of InterfaceType", async () => {
      const partialType = TypeCreator.CreatePartial(SimpleInterfaceType, {
        name: "MyPartialSimpleInterfaceType",
        description: "an interface partial type"
      });
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "MyPartialSimpleInterfaceType") as IntrospectionInterfaceType;

      expect(simpleType.kind).toBe(TypeKind.INTERFACE);
      expect(simpleType.description).toBe("an interface partial type");

      expect(simpleType.fields.length).toEqual(1);
      expect(simpleType.fields[0].type.kind).not.toBe("NON_NULL");
    });

    it("Should create a RequiredType of InputType", async () => {
      const partialType = TypeCreator.CreatePartial(SimpleInputType, {
        name: "MyPartialSimpleInputTypeForRequired",
        description: "an input partial type"
      });
      const requiredType = TypeCreator.CreateRequired(partialType, {
        name: "MyRequiredSimpleInputType",
        description: "an input required type"
      });
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "MyRequiredSimpleInputType") as IntrospectionInputObjectType;

      expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);
      expect(simpleType.description).toBe("an input required type");

      expect(simpleType.inputFields.length).toEqual(1);
      expect(simpleType.inputFields[0].type.kind).toBe("NON_NULL");
    });

    it("Should create a RequiredType of ObjectType", async () => {
      const partialType = TypeCreator.CreatePartial(SimpleObjectType, {
        name: "MyPartialSimpleObjectTypeForRequired",
        description: "an object partial type"
      });
      const requiredType = TypeCreator.CreateRequired(partialType, {
        name: "MyRequiredSimpleObjectType",
        description: "an object required type"
      });
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "MyRequiredSimpleObjectType") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);
      expect(simpleType.description).toBe("an object required type");

      expect(simpleType.fields.length).toEqual(2);
      expect(simpleType.fields[0].type.kind).toBe("NON_NULL");
      expect(simpleType.fields[1].type.kind).toBe("NON_NULL");
    });

    it("Should create a RequiredType of InterfaceType", async () => {
      const partialType = TypeCreator.CreatePartial(SimpleInterfaceType, {
        name: "MyPartialSimpleInterfaceTypeForRequired",
        description: "an interface partial type"
      });
      const requiredType = TypeCreator.CreateRequired(partialType, {
        name: "MyRequiredSimpleInterfaceType",
        description: "an interface required type"
      });
      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "MyRequiredSimpleInterfaceType") as IntrospectionInterfaceType;

      expect(simpleType.kind).toBe(TypeKind.INTERFACE);
      expect(simpleType.description).toBe("an interface required type");

      expect(simpleType.fields.length).toEqual(1);
      expect(simpleType.fields[0].type.kind).toBe("NON_NULL");
    });

    it("Should create multiple version of a class with different gqlType", async () => {
      @InputType("InputThreeTypes", {
        description: "input"
      })
      @InterfaceType("InterfaceThreeTypes", {
        description: "interface"
      })
      @ObjectType("ObjectThreeTypes", {
        description: "object"
      })
      class ThreeTypesCustom {
        @Field()
        threeField: String;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const ObjectThreeTypes = schema.types.find((schemaType) => schemaType.name === "ObjectThreeTypes") as IntrospectionObjectType;
      const InputThreeTypes = schema.types.find((schemaType) => schemaType.name === "InputThreeTypes") as IntrospectionInputObjectType;
      const InterfaceThreeTypes = schema.types.find((schemaType) => schemaType.name === "InterfaceThreeTypes") as IntrospectionInterfaceType;

      expect(ObjectThreeTypes.kind).toBe(TypeKind.OBJECT);
      expect(ObjectThreeTypes.description).toBe("object");

      expect(InputThreeTypes.kind).toBe(TypeKind.INPUT_OBJECT);
      expect(InputThreeTypes.description).toBe("input");

      expect(InterfaceThreeTypes.kind).toBe(TypeKind.INTERFACE);
      expect(InterfaceThreeTypes.description).toBe("interface");
    });

    it("Shouldn't create an isAbtract type", async () => {
      @ObjectType({ isAbstract: true })
      class AbstractType {
        @Field()
        abstractField: String;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const index = schema.types.findIndex((schemaType) => schemaType.name === "AbstractType");
      expect(index).toBe(-1);
    });

    it("Should create a field with scalar type", async () => {
      const MyScalar = new GraphQLScalarType({
        name: "MyScalar",
        description: "MyScalar",
        parseValue(value: string) {
          return "a";
        },
        serialize(value: string) {
          return "a";
        },
        parseLiteral(ast) {
          return "a";
        }
      });

      @ObjectType()
      class ScalarType {
        @Field(type => MyScalar)
        abstractField: string;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const scalarType = schema.types.find((schemaType) => schemaType.name === "ScalarType") as IntrospectionObjectType;

      expect(scalarType.fields.length).toEqual(1);
      expect(scalarType.fields[0].type.kind).toBe("NON_NULL");
      expect((scalarType.fields[0].type as any).ofType.name).toBe("MyScalar");
    });
  });
});
