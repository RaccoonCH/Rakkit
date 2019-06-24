import { Recipe } from "./recipe-type";

export function createRecipeSamples() {
  return [
    new Recipe(
      "Recipe 1",
      new Date("2018-04-11"),
      [0, 3, 1],
      "Desc 1"
    ),
    new Recipe(
      "Recipe 2",
      new Date("2018-04-15"),
      [4, 2, 3, 1],
      "Desc 2"
    ),
    new Recipe(
      "Recipe 3",
      new Date(),
      [5, 4],
      "Desc 3"
    )
  ];
}
