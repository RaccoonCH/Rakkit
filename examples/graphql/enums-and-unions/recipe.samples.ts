import { Recipe } from "./recipe.type";
import { Difficulty } from "./difficulty.enum";
import { sampleCooks } from "./cook.samples";

export const sampleRecipes = [
  new Recipe(
    "Recipe 1",
    ["one", "two", "three"],
    Difficulty.Easy,
    sampleCooks[1],
    "Desc 1"
  ),
  new Recipe(
    "Recipe 2",
    ["four", "five", "six"],
    Difficulty.Easy,
    sampleCooks[0],
    "Desc 2"
  ),
  new Recipe(
    "Recipe 3",
    ["seven", "eight", "nine"],
    Difficulty.Beginner,
    sampleCooks[1]
  ),
  new Recipe(
    "Recipe 4",
    ["ten", "eleven", "twelve"],
    Difficulty.MasterChef,
    sampleCooks[0],
    "Desc 4"
  ),
  new Recipe(
    "Recipe 5",
    ["thirteen", "fourteen", "fifteen"],
    Difficulty.Hard,
    sampleCooks[0]
  )
];
