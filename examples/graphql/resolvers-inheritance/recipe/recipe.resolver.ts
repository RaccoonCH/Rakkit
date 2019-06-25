import { Resolver, FieldResolver, IContext } from "../../../../src";

import { ResourceResolver } from "../resource/resource.resolver";
import { Recipe } from "./recipe.type";

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Recipe 1",
    ratings: [1, 3, 4]
  }
];

@Resolver(of => Recipe)
export class RecipeResolver extends ResourceResolver(Recipe, recipes) {
  // here you can add resource-specific operations

  @FieldResolver()
  averageRating(context: IContext<any, Recipe>): number {
    const root = context.gql.root;
    return root.ratings.reduce((a, b) => a + b, 0) / root.ratings.length;
  }
}
