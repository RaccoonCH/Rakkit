import { ObjectType, Field, InputType, InterfaceType, IClassType, NameFrom } from "../../../../src";

@InputType("aaa")
export class ExampleInputType {
  @Field()
  hello3: string;
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

@InterfaceType("dsss")
export class ExampleInterfaceType {
  @Field()
  hello3: string;
}

@InterfaceType("asd")
export class ExampleInterfaceType2 {
  @Field()
  hello4: string;
}

function GetItems<Type, Type2>(
  itemsType: IClassType<Type>,
  itemsType2: IClassType<Type2>
) {
  @NameFrom(itemsType, itemsType2)
  @ObjectType("caca", ExampleInterfaceType, ExampleInterfaceType2)
  abstract class Response implements ExampleInterfaceType, ExampleInterfaceType2 {
    hello3: string;
    hello4: string;

    @Field(type => itemsType, {
      required: true,
      nullable: true
    })
    items?: Type[];

    @Field(type => itemsType2)
    items2: Type2;
  }
  return Response;
}

GetItems(ExampleObjectType, ExampleObjectType0);

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
