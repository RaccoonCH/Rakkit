import { ObjectType, Field, InputType, Nullable, Deprecated, InterfaceType, GenericField, GenericType } from "../../../../src";

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
export class ExampleObjectType0 {
  @Field()
  hello0: string;
}

@ObjectType()
export class ExampleObjectType {
  @Field()
  hello: string;
}

@GenericType()
@ObjectType(ExampleInterfaceType, ExampleInterfaceType2)
export class ExampleObjectType2<Type> extends ExampleObjectType0 implements ExampleInterfaceType, ExampleInterfaceType2 {
  hello4: string;
  hello3: string;

  @Field(type => ExampleObjectType, "ddd")
  @Nullable()
  @Deprecated()
  hello2?: ExampleObjectType[];

  @GenericField()
  generic: Type;

  @Nullable()
  @Deprecated("sss")
  hello: string;

  @Field()
  date: Date;
}

@InputType()
export class ExampleInputType {
  @Field()
  hello3: string;
}
