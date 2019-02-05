import { ObjectType, Field} from "type-graphql";
import { IGetResponse } from "@types";
import { ExampleModel } from "@api/Example/Example.model";

@ObjectType()
export abstract class ExampleGetResponse implements IGetResponse {
  @Field()
  readonly count: number;

  @Field(type => [ExampleModel])
  readonly items: ExampleModel[];
}
