import { ObjectType, Field, InputType } from "../../../../src";

@ObjectType()
export class ExampleObjectType {
  @Field()
  hello: string;
}

@ObjectType()
export class ExampleObjectType2 {
  @Field()
  hello2: string;
}


@InputType()
export class ExampleInputType {
  @Field()
  hello3: string;
}
