import { ObjectId } from "mongodb";
import { Resolver, Query, FieldResolver, Arg, Mutation, IContext } from "../../../../src";

import { Recipe, RecipeModel } from "../entities/recipe";
import { Rate } from "../entities/rate";
import { User, UserModel } from "../entities/user";
import { RecipeInput } from "./types/recipe-input";
import { RateInput } from "./types/rate-input";
import { ObjectIdScalar } from "../object-id.scalar";

@Resolver(of => Recipe)
export class RecipeResolver {
  @Query(returns => Recipe, { nullable: true })
  async recipe(
    @Arg("recipeId", type => ObjectIdScalar)
    recipeId: ObjectId
  ) {
    const recipe = await RecipeModel.findById(recipeId);
    return recipe;
  }

  @Query(returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return await RecipeModel.find({});
  }

  @Mutation(returns => Recipe)
  async addRecipe(
    @Arg("recipe") recipeInput: RecipeInput,
    context: IContext<any, User>
  ): Promise<Recipe> {
    const recipe = new RecipeModel({
      ...recipeInput,
      author: context.gql.root._id
    } as Recipe);

    return await recipe.save();
  }

  @Mutation(returns => Recipe)
  async rate(
    @Arg("rate")
    rateInput: RateInput,
    context: IContext<any, User>
  ): Promise<Recipe> {
    // find the recipe
    const recipe = await RecipeModel.findById(rateInput.recipeId);
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // set the new recipe rate
    const newRate: Rate = {
      value: rateInput.value,
      user: context.gql.root._id,
      date: new Date()
    };

    // update the recipe
    (recipe.ratings as Rate[]).push(newRate);
    await recipe.save();
    return recipe;
  }

  @FieldResolver(type => User)
  async author(context: IContext<any, Recipe>): Promise<User> {
    return (await UserModel.findById(context.gql.root.author))!;
  }
}
