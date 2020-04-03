import { plainToClass } from "class-transformer";
import {
  Arg,
  FieldResolver,
  IContext,
  Int,
  Mutation,
  Query,
  Resolver,
} from "rakkit";
import { RecipeInput } from "src/simple-usage/recipe-input";
import { createRecipeSamples } from "src/simple-usage/recipe-samples";
import { Recipe } from "src/simple-usage/recipe-type";

@Resolver((of) => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = createRecipeSamples();

  @Query((returns) => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    return await this.items.find((recipe) => recipe.title === title);
  }

  @Query((returns) => [Recipe], {
    description: "Get all the recipes from around the world ",
  })
  async recipes(): Promise<Recipe[]> {
    return await this.items;
  }

  @Mutation((returns) => Recipe)
  async addRecipe(@Arg("recipe") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = plainToClass(Recipe, {
      description: recipeInput.description,
      title: recipeInput.title,
      ratings: [],
      creationDate: new Date(),
    });
    await this.items.push(recipe);
    return recipe;
  }

  @FieldResolver()
  ratingsCount(
    @Arg("minRate", (type) => Int, { defaultValue: 0.0 }) minRate: number,
    context: IContext<any, Recipe>
  ): number {
    return context.gql.root.ratings.filter((rating) => rating >= minRate)
      .length;
  }
}
