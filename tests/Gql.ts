// #region Imports
import {
  Rakkit,
  ObjectType,
  Field,
  MetadataStorage,
  Resolver,
  Query,
  InterfaceType,
  InputType,
  EnumType,
  EnumField,
  TypeCreator
} from "../src";
import {
  graphql,
  IntrospectionQuery,
  getIntrospectionQuery,
  TypeKind,
  IntrospectionInterfaceType,
  IntrospectionObjectType,
  IntrospectionInputObjectType,
  IntrospectionEnumType,
  printSchema,
  GraphQLObjectType
} from "graphql";
// #endregion

@Resolver()
class BaseResolver {
  @Query()
  hello(): String {
    return "hello";
  }
}

@EnumType("SimpleEnumClass", {
  description: "a simple enum from class"
})
class SimpleEnumClassType {
  @EnumField("hello", {
    description: "enum field description",
    deprecationReason: "deprecated"
  })
  enumField: string;
}

@InterfaceType("SimpleInterface", {
  description: "a simple interface"
})
class SimpleInterfaceType {
  @Field({
    deprecationReason: "deprecated",
    description: "an interface field"
  })
  interfaceField: number;
}

@ObjectType("SimpleType", {
  description: "a simple type",
  implements: SimpleInterfaceType
})
class SimpleObjectType implements SimpleInterfaceType {
  @Field({
    deprecationReason: "deprecated",
    description: "an object field"
  })
  field: string;
  interfaceField: number;
}

@InputType("SimpleInput", {
  description: "a simple input"
})
class SimpleInputType {
  @Field({
    defaultValue: "123",
    description: "an input field"
  })
  inputField: string;
}

enum enumType {
  a = "a"
}

const enumFromTypeCreator = TypeCreator.CreateEnum(enumType, {
  name: "SimpleEnumTypeCreator",
  description: "a simple enum from TypeCreator"
});

describe("GraphQL", () => {
  afterEach(async () => {
    await Rakkit.stop();
  });

  describe("Simple type definition", () => {
    it("Should create an interface type", async () => {
      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleInterface") as IntrospectionInterfaceType;

      expect(simpleType.kind).toBe(TypeKind.INTERFACE);
      expect(simpleType.description).toBe("a simple interface");
      expect(simpleType.fields[0].name).toBe("interfaceField");
      expect(simpleType.fields[0].deprecationReason).toBe("deprecated");
      expect(simpleType.fields[0].description).toBe("an interface field");
    });

    it("Should create an object type", async () => {
      await Rakkit.start();
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

    it("Should create an input type", async () => {
      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleInput") as IntrospectionInputObjectType;

      expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);
      expect(simpleType.description).toBe("a simple input");
      expect(simpleType.inputFields[0].name).toBe("inputField");
      expect(simpleType.inputFields[0].defaultValue).toBe("\"123\"");
      expect(simpleType.inputFields[0].description).toBe("an input field");
    });

    it("Should create a enum type from class", async () => {
      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleEnumClass") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.description).toBe("a simple enum from class");
      expect(simpleType.enumValues[0].name).toBe("enumField");
      expect(simpleType.enumValues[0].deprecationReason).toBe("deprecated");
      expect(simpleType.enumValues[0].description).toBe("enum field description");
    });

    it("Should create a enum type from TypeCreator", async () => {
      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleEnumTypeCreator") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.description).toBe("a simple enum from TypeCreator");
      expect(simpleType.enumValues[0].name).toBe("a");
    });

    it("Should create a PartialType of ObjectType", async () => {
      const partialType = TypeCreator.CreatePartial(SimpleObjectType, {
        name: "MyPartialSimpleObjectType",
        description: "a partial type"
      });
      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "MyPartialSimpleObjectType") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);
      expect(simpleType.description).toBe("a partial type");
      expect(simpleType.fields[0].type.kind).not.toBe("NON_NULL");
      expect(simpleType.fields[1].type.kind).not.toBe("NON_NULL");
    });
  });

  describe("Ihneritance", () => {
    it("ObjectType should extends", async () => {
      @ObjectType()
      class ObjectTypeIhneritance extends SimpleObjectType {
        @Field()
        ihnField: string;
      }

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "ObjectTypeIhneritance") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);
      expect(simpleType.fields.map((field) => field.name)).toEqual(["ihnField", "interfaceField", "field"]);
    });

    it("InputType should extends", async () => {
      @InputType()
      class InputTypeIhneritance extends SimpleObjectType {
        @Field()
        ihnField: string;
      }

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InputTypeIhneritance") as IntrospectionInputObjectType;

      expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);
      expect(simpleType.inputFields.map((field) => field.name)).toEqual(["ihnField", "interfaceField", "field"]);
    });

    it("InterfaceType should extends", async () => {
      @InterfaceType()
      class InterfaceTypeIhneritance extends SimpleObjectType {
        @Field()
        ihnField: string;
      }

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InterfaceTypeIhneritance") as IntrospectionInterfaceType;

      expect(simpleType.kind).toBe(TypeKind.INTERFACE);
      expect(simpleType.fields.map((field) => field.name)).toEqual(["ihnField", "interfaceField", "field"]);
    });

    it("class EnumType should extends from class", async () => {
      @EnumType()
      class EnumTypeIhneritance extends SimpleEnumClassType {
        @EnumField("a")
        a: string;
      }

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "EnumTypeIhneritance") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.enumValues.map((field) => field.name)).toEqual(["a", "enumField"]);
    });

    it("class EnumType should extends from TypeCreator", async () => {
      @EnumType({
        extends: enumFromTypeCreator
      })
      class EnumTypeIhneritanceTypeCreator {
        @EnumField("b")
        b: string;
      }

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "EnumTypeIhneritanceTypeCreator") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.enumValues.map((field) => field.name)).toEqual(["b", "a"]);
    });

    it("TypeCreator EnumType should extends from TypeCreator", async () => {
      enum enumIhneritance {
        b = "b"
      }

      TypeCreator.CreateEnum(enumIhneritance, {
        name: "enumIhneritance",
        description: "enum ihneritance",
        extends: enumFromTypeCreator
      });

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "enumIhneritance") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.enumValues.map((field) => field.name)).toEqual(["b", "a"]);
    });

    it("TypeCreator EnumType should extends from class", async () => {
      enum enumIhneritance {
        a = "a"
      }

      TypeCreator.CreateEnum(enumIhneritance, {
        name: "enumIhneritanceClass",
        description: "enum ihneritance",
        extends: SimpleEnumClassType
      });

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "enumIhneritanceClass") as IntrospectionEnumType;

      expect(simpleType.kind).toBe(TypeKind.ENUM);
      expect(simpleType.enumValues.map((field) => field.name)).toEqual(["a", "enumField"]);
    });

    it("ObjectType should extends from TypeCreator", async () => {
      const partial = TypeCreator.CreatePartial(SimpleObjectType, {
        gqlType: GraphQLObjectType
      });

      @ObjectType({
        extends: partial
      })
      class ObjectTypeTypeCreatorIhneritance {
        @Field()
        ihnField: String;
      }

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "ObjectTypeTypeCreatorIhneritance") as IntrospectionObjectType;

      expect(simpleType.kind).toBe(TypeKind.OBJECT);
      expect(simpleType.fields.map((field) => field.name)).toEqual(["ihnField", "field", "interfaceField"]);
    });

    it("InterfaceType should extends from TypeCreator", async () => {
      const partial = TypeCreator.CreatePartial(SimpleObjectType, {
        gqlType: GraphQLObjectType
      });

      @InterfaceType({
        extends: partial
      })
      class InterfaceTypeTypeCreatorIhneritance {
        @Field()
        ihnField: String;
      }

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InterfaceTypeTypeCreatorIhneritance") as IntrospectionInterfaceType;

      expect(simpleType.kind).toBe(TypeKind.INTERFACE);
      expect(simpleType.fields.map((field) => field.name)).toEqual(["ihnField", "field", "interfaceField"]);
    });

    it("InputType should extends from TypeCreator", async () => {
      const partial = TypeCreator.CreatePartial(SimpleObjectType, {
        gqlType: GraphQLObjectType
      });

      @InputType({
        extends: partial
      })
      class InputTypeTypeCreatorIhneritance {
        @Field()
        ihnField: String;
      }

      await Rakkit.start();
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "InputTypeTypeCreatorIhneritance") as IntrospectionInputObjectType;

      expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);
      expect(simpleType.inputFields.map((field) => field.name)).toEqual(["ihnField", "field", "interfaceField"]);
    });
  });
});
