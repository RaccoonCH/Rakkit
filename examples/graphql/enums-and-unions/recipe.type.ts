import { Field, ObjectType } from "../../../src";
import { Difficulty } from "./difficulty.enum";
import { Cook } from "./cook.type";

@ObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [String])
  ingredients: string[];

  @Field(type => Difficulty)
  preparationDifficulty: Difficulty;

  @Field()
  cook: Cook;

  constructor(
    title: string,
    ingredients: string[],
    preparationDifficulty: Difficulty,
    cook: Cook,
    description?: string
  ) {
    this.title = title;
    this.ingredients = ingredients;
    this.preparationDifficulty = preparationDifficulty;
    this.cook = cook;
    this.description = description;
  }
}
