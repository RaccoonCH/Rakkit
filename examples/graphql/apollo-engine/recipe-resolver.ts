import {
  Resolver,
  Query,
  Arg
} from "../../../src";

import { Recipe } from "./recipe-type";
import { createRecipeSamples } from "./recipe-samples";

@Resolver(of => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = createRecipeSamples();

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    return await this.items.find(recipe => recipe.title === title);
  }

  @Query(returns => Recipe, { nullable: true })
  async cachedRecipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    console.log(`Called 'cachedRecipe' with title '${title}'`);
    return await this.items.find(recipe => recipe.title === title);
  }

  @Query(returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return await this.items;
  }
}
