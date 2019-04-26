import { ObjectType, Field, InputType, InterfaceType, IClassType, ConcatName, TypeCreator, EnumType, EnumField } from "../../../../src";
import { GraphQLInterfaceType, GraphQLObjectType } from "graphql";

export enum TestEnum {
  a = "a",
  b = "b"
}

const enumType = TypeCreator.CreateEnum(TestEnum, { name: "testEnum" });

export class ScalarMapTest {
}

@EnumType("MyEnumClassType", {
  description: "An enum type generated from a class"
})
export class MyClassEnum {
  @EnumField("SuperValue")
  yop: string;
}

@InputType()
@ObjectType({
  description: "My example InputType"
})
@InterfaceType("Test")
export class ExampleInputType {
  @Field()
  hello3: string;

  @Field(type => enumType)
  enumz: TestEnum;

  @Field(type => String, { nullable: true })
  async resolveMe?(): Promise<String> {
    return "aaa";
  }
}

const RequiredExampleInputType = TypeCreator.CreateRequired(ExampleInputType, {
  name: "RequiredExampleInputType",
  gqlType: GraphQLObjectType
});

@InputType()
@InterfaceType()
@ObjectType()
export class PO0 {
  @Field()
  po: string;
}

@InputType()
@InterfaceType()
@ObjectType()
export class PO1 implements PO0 {
  @Field()
  po: string;

  @Field()
  po0: PO0;
}

@InputType()
@ObjectType({ implements: PO1 })
export class PO2 implements PO1 {
  @Field()
  str: string;

  @Field()
  po: string;

  @Field()
  po02: PO0;

  @Field()
  po0: PO0;
}

@InputType()
@ObjectType()
@ConcatName(RequiredExampleInputType)
export class ExampleInputType2 {
  @Field()
  hello3: string;

  @Field({ nullable: true })
  hello12: string;
}

@ConcatName(RequiredExampleInputType)
@ObjectType({
  description: "ObjectType named from required ExampleInputType"
})
export class ExampleObjectType0 {
  @Field(type => String)
  hello0: string[];
}

@InterfaceType()
export class MyInterface {
  @Field()
  myInterfaceField: string;
}

@ObjectType({
  implements: MyInterface
})
export class MyInterfaceObj1 implements MyInterface {
  @Field()
  myInterfaceField: string;

  @Field()
  yo: string;
}

@ObjectType({
  implements: MyInterface
})
export class MyInterfaceObj2 implements MyInterface {
  @Field()
  myInterfaceField: string;
}

@ObjectType()
export class ExampleObjectType {
  @Field({ nullable: true })
  hello: string;

  @Field()
  test: MyInterface;
}

@ObjectType()
@InterfaceType()
export class ExampleInterfaceType {
  @Field()
  hello3: string;
  @Field({ gqlType: GraphQLInterfaceType })
  ms: ExampleInputType;
}

@InterfaceType()
export class ExampleInterfaceType2 {
  @Field()
  hello4: ScalarMapTest;
}

@ObjectType()
export abstract class Response<Type, Type2> implements ExampleInterfaceType, ExampleInterfaceType2 {
  @Field({ nullable: true })
  hello3: string;
  @Field()
  hello4: string;
  @Field({ nullable: true })
  hello6: ExampleInputType;
  ms: ExampleInputType;
  items?: Type[];
  items2: Type2;
}

export function getItems<Type, Type2>(
  itemsType: IClassType<Type>,
  itemsType2: IClassType<Type2>
): IClassType<Response<Type, Type2>> {
  @ConcatName(itemsType, itemsType2)
  @InputType()
  class GenericResponse extends Response<Type, Type2> {
    get A() {
      return this.items;
    }

    @Field(type => itemsType, {
      nullable: true,
      description: "items",
      defaultValue: []
    })
    items: Type[];

    @Field(type => itemsType2)
    items2: Type2;

    hello() {
      console.log("sss");
    }
  }
  return GenericResponse as any;
}

@ObjectType({
  implements: [ExampleInterfaceType, ExampleInterfaceType2],
  extends: RequiredExampleInputType
})
export class ExampleObjectType2 implements ExampleInterfaceType, ExampleInterfaceType2 {
  @Field()
  date: Date;
  @Field(type => ExampleObjectType, {
    nullable: true
  })
  hello2?: ExampleObjectType;

  hello4: string;
  hello3: string;
  ms: ExampleInputType;
}
