// #region Imports
import "reflect-metadata";
import {
  ObjectType,
  Field,
  Resolver,
  Query,
  InterfaceType,
  InputType,
  EnumType,
  EnumField,
  TypeCreator
} from "../../..";
// #endregion

export class ScalarMap {}

@Resolver()
export class BaseResolver {
  @Query()
  hello(): String {
    return "hello";
  }
}

@EnumType("SimpleEnumClass", {
  description: "a simple enum from class"
})
export class SimpleEnumClassType {
  @EnumField("hello", {
    description: "enum field description",
    deprecationReason: "deprecated"
  })
  enumField: string;
}

@InterfaceType("SimpleInterface", {
  description: "a simple interface"
})
export class SimpleInterfaceType {
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
export class SimpleObjectType implements SimpleInterfaceType {
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
export class SimpleInputType {
  @Field({
    defaultValue: "123",
    description: "an input field"
  })
  inputField: string;
}

export enum enumType {
  a = "a"
}

export const enumFromTypeCreator = TypeCreator.CreateEnum(enumType, {
  name: "SimpleEnumTypeCreator",
  description: "a simple enum from TypeCreator"
});

@ObjectType()
export class ObjectTypeForUnion {
  @Field()
  unionField: String;
}

export const unionType = TypeCreator.CreateUnion(
  [SimpleObjectType, ObjectTypeForUnion],
  { name: "UnionType", description: "an union type" }
);

@InputType()
@InterfaceType()
@ObjectType()
export class ThreeTypes {
  @Field()
  threeField: String;
}
