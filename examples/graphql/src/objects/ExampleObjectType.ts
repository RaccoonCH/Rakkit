import { ObjectType, Field, InputType, InterfaceType, IClassType, NameFrom } from "../../../../src";

@InputType()
@ObjectType("a")
@InterfaceType()
export class ExampleInputType {
  @Field()
  hello3: string;
}

@InputType()
@ObjectType("aa", ExampleInputType)
export class ExampleInputType2 {
  @Field()
  hello12: string;
}

@ObjectType()
export class ExampleObjectType0 {
  @Field()
  hello0: string;
}

@ObjectType()
export class ExampleObjectType {
  @Field({ nullable: true, partial: true })
  hello: string;
}

@InterfaceType()
export class ExampleInterfaceType {
  @Field()
  hello3: string;
}

@InterfaceType()
export class ExampleInterfaceType2 {
  @Field()
  hello4: string;
}

@ObjectType()
export abstract class Response<Type, Type2> implements ExampleInterfaceType, ExampleInterfaceType2 {
  @Field()
  hello3: string;
  @Field()
  hello4: string;
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

@ObjectType([ExampleInterfaceType, ExampleInterfaceType2])
export class ExampleObjectType2 extends ExampleObjectType0 implements ExampleInterfaceType, ExampleInterfaceType2 {
  hello4: string;
  hello3: string;

  @Field(type => ExampleObjectType, {
    nullable: true,
    required: true
  })
  hello2?: Required<ExampleObjectType>;

  hello: string;

  @Field()
  date: Date;
}
