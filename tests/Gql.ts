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
  IntrospectionEnumType
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
    deprecationReason: "deprecated..."
  })
  enumField: string;
}

@InterfaceType("SimpleInterface", {
  description: "a simple interface"
})
class SimpleInterfaceType {
  @Field()
  interfaceField: number;
}

@ObjectType("SimpleType", {
  description: "a simple type",
  implements: SimpleInterfaceType
})
class SimpleObjectType implements SimpleInterfaceType {
  @Field()
  field: string;
  interfaceField: number;
}

@InputType("SimpleInput", {
  description: "a simple input"
})
class SimpleInputType {
  @Field()
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

  it("Should create an interface type", async () => {
    await Rakkit.start();
    const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
    const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleInterface") as IntrospectionInterfaceType;

    expect(simpleType.kind).toBe(TypeKind.INTERFACE);
    expect(simpleType.description).toBe("a simple interface");
    expect(simpleType.fields[0].name).toBe("interfaceField");
  });

  it("Should create an object type", async () => {
    await Rakkit.start();
    const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
    const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleType") as IntrospectionObjectType;

    expect(simpleType.kind).toBe(TypeKind.OBJECT);
    expect(simpleType.description).toBe("a simple type");
    expect(simpleType.fields.map((field) => field.name)).toEqual(["interfaceField", "field"]);
    expect(simpleType.interfaces).toHaveLength(1);
    expect(simpleType.interfaces[0].name).toBe("SimpleInterface");
  });

  it("Should create an input type", async () => {
    await Rakkit.start();
    const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
    const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleInput") as IntrospectionInputObjectType;

    expect(simpleType.kind).toBe(TypeKind.INPUT_OBJECT);
    expect(simpleType.description).toBe("a simple input");
    expect(simpleType.inputFields[0].name).toBe("inputField");
  });

  it("Should create a enum type from class", async () => {
    await Rakkit.start();
    const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
    const simpleType = schema.types.find((schemaType) => schemaType.name === "SimpleEnumClass") as IntrospectionEnumType;

    expect(simpleType.kind).toBe(TypeKind.ENUM);
    expect(simpleType.description).toBe("a simple enum from class");
    expect(simpleType.enumValues[0].name).toBe("enumField");
    expect(simpleType.enumValues[0].deprecationReason).toBe("deprecated...");
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

  it("Should extends correctly from same GraphQL type", async () => {
  });
});
