import { ObjectType, Field, InputType, InterfaceType, IClassType, NameFrom, TypeCreator, EnumType, EnumField } from "../../../../src";
import { GraphQLInterfaceType } from "graphql";

export enum TestEnum {
  a = "a",
  b = "b"
}

const enumType = TypeCreator.CreateEnum(TestEnum, { name: "testenum" });

@EnumType()
export class MyClassEnum {
  @EnumField("jafsd")
  yop: string;
}

@InputType()
@ObjectType()
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

const PartialA = TypeCreator.CreateRequired(ExampleInputType);

@NameFrom(PartialA)
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
@ObjectType({ implements: [PO1] })
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
export class ExampleInputType2 {
  @Field()
  hello3: string;

  @Field({ nullable: true })
  hello12: string;
}

@ObjectType()
export class ExampleObjectType0 {
  @Field()
  hello0: string;
}

@InterfaceType()
export class MyInterface {
  @Field()
  myInterfaceField: string;
}

@ObjectType({
  implements: [MyInterface]
})
export class MyInterfaceObj1 implements MyInterface {
  @Field()
  myInterfaceField: string;

  @Field()
  yo: string;
}

@ObjectType({
  implements: [MyInterface]
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
  hello4: string;
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
  @NameFrom(itemsType, itemsType2)
  @InputType()
  class GenericResponse extends Response<Type, Type2> {
    get A() {
      return this.items;
    }

    @Field(type => itemsType, {
      nullable: true
    })
    items;

    @Field(type => itemsType2)
    items2;

    hello() {
      console.log("sss");
    }
  }
  return GenericResponse as any;
}

@ObjectType({
  implements: [ExampleInterfaceType, ExampleInterfaceType2],
  extends: PartialA
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
