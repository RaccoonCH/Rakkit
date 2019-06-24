import { ID, Field, InputType } from "../../../src";

@InputType()
export class NewCommentsInput {
  @Field(type => ID)
  recipeId: string;
}
