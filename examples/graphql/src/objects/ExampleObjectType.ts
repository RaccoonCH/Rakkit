import { ObjectType, Field, InputType, Nullable, Deprecated, InterfaceType, IClassType, GenericName, Partial } from "../../../../src";

@InputType()
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
  @Field()
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

function GetItems<Type, Type2>(itemsType: IClassType<Type>, itemsType2: IClassType<Type2>) {
  @GenericName(itemsType, itemsType2)
  @ObjectType(ExampleInterfaceType, ExampleInterfaceType2)
  abstract class Response implements ExampleInterfaceType, ExampleInterfaceType2 {
    hello3: string;
    hello4: string;

    @Field(type => itemsType)
    @Nullable()
    @Partial()
    items?: Type[];

    @Field(type => itemsType2)
    items2: Type2;
  }
  return Response;
}

GetItems(ExampleObjectType, ExampleObjectType0);

@ObjectType(ExampleInterfaceType, ExampleInterfaceType2)
export class ExampleObjectType2 extends ExampleObjectType0 implements ExampleInterfaceType, ExampleInterfaceType2 {
  hello4: string;
  hello3: string;

  @Field(type => ExampleObjectType, "ddd")
  @Nullable()
  @Deprecated()
  @Partial()
  hello2?: ExampleObjectType[];

  @Nullable()
  @Deprecated("sss")
  hello: string;

  @Field()
  date: Date;
}
