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
  GraphQLObjectType
} from "graphql";
import {
  Rakkit,
  ObjectType,
  Field,
  InterfaceType,
  InputType,
  EnumType,
  EnumField,
  TypeCreator,
  GQLObjectType
} from "../../..";
import {
  SimpleObjectType,
  SimpleEnumClassType,
  enumFromTypeCreator
} from "./Utils/Classes";
import { MetadataStorage } from "../../Core/Logic/MetadataStorage";
// #endregion

describe("GraphQL", () => {
  afterEach(async () => {
    await Rakkit.stop();
  });

  describe("Inheritance", () => {
    it("ObjectType should extends", async () => {
      @ObjectType()
      class ObjectTypeInheritance extends SimpleObjectType {
        @Field()
        inhField: string;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "ObjectTypeInheritance") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);
      expect(simpleType.fields.map((field) => field.name)).toEqual(["inhField", "interfaceField", "field"]);
    });

    it("InputType should extends", async () => {
      @InputType()
      class InputTypeInheritance extends SimpleObjectType {
        @Field()
        inhField: string;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InputTypeInheritance") as IntrospectionInputObjectType;

      expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);
      expect(simpleType.inputFields.map((field) => field.name)).toEqual(["inhField", "interfaceField", "field"]);
    });

    it("InterfaceType should extends", async () => {
      @InterfaceType()
      class InterfaceTypeInheritance extends SimpleObjectType {
        @Field()
        inhField: string;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InterfaceTypeInheritance") as IntrospectionInterfaceType;

      expect(simpleType.kind).toBe(TypeKind.INTERFACE);
      expect(simpleType.fields.map((field) => field.name)).toEqual(["inhField", "interfaceField", "field"]);
    });

    it("class EnumType should extends from class", async () => {
      @EnumType()
      class EnumTypeInheritance extends SimpleEnumClassType {
        @EnumField("a")
        a: string;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "EnumTypeInheritance") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.enumValues.map((field) => field.name)).toEqual(["a", "enumField"]);
    });

    it("class EnumType should extends from TypeCreator", async () => {
      @EnumType({
        extends: enumFromTypeCreator
      })
      class EnumTypeInheritanceTypeCreator {
        @EnumField("b")
        b: string;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "EnumTypeInheritanceTypeCreator") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.enumValues.map((field) => field.name)).toEqual(["b", "a"]);
    });

    it("TypeCreator EnumType should extends from TypeCreator", async () => {
      enum enumInheritance {
        b = "b"
      }

      TypeCreator.CreateEnum(enumInheritance, {
        name: "enumInheritance",
        description: "enum inheritance",
        extends: enumFromTypeCreator
      });

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "enumInheritance") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.enumValues.map((field) => field.name)).toEqual(["b", "a"]);
    });

    it("TypeCreator EnumType should extends from class", async () => {
      enum enumInheritance {
        a = "a"
      }

      TypeCreator.CreateEnum(enumInheritance, {
        name: "enumInheritanceClass",
        description: "enum inheritance",
        extends: SimpleEnumClassType
      });

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "enumInheritanceClass") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.enumValues.map((field) => field.name)).toEqual(["a", "enumField"]);
    });

    it("ObjectType should extends from TypeCreator", async () => {
      const partial = TypeCreator.CreatePartial(SimpleObjectType, {
        gqlType: GQLObjectType
      });

      @ObjectType({
        extends: partial
      })
      class ObjectTypeTypeCreatorInheritance {
        @Field()
        inhField: String;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "ObjectTypeTypeCreatorInheritance") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);
      expect(simpleType.fields.map((field) => field.name)).toEqual(["inhField", "field", "interfaceField"]);
    });

    it("InterfaceType should extends from TypeCreator", async () => {
      const partial = TypeCreator.CreatePartial(SimpleObjectType, {
        gqlType: GQLObjectType
      });

      @InterfaceType({
        extends: partial
      })
      class InterfaceTypeTypeCreatorInheritance {
        @Field()
        inhField: String;
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InterfaceTypeTypeCreatorInheritance") as IntrospectionInterfaceType;

      expect(simpleType.kind).toBe(TypeKind.INTERFACE);
      expect(simpleType.fields.map((field) => field.name)).toEqual(["inhField", "field", "interfaceField"]);
    });

    it("InputType should extends from TypeCreator", async () => {
      const partial = TypeCreator.CreatePartial(SimpleObjectType, {
        gqlType: GQLObjectType
      });

      @InputType({
        extends: partial
      })
      class InputTypeTypeCreatorInheritance {
        @Field()
        inhField: String;
      }

      await Rakkit.start({ silent: true });

      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InputTypeTypeCreatorInheritance") as IntrospectionInputObjectType;

      expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);
      expect(simpleType.inputFields.map((field) => field.name)).toEqual(["inhField", "field", "interfaceField"]);
    });
  });
});
