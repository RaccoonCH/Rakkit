import { TypeCreator } from "../../../src";

import { Recipe } from "./recipe.type";
import { Cook } from "./cook.type";

export const SearchResult = TypeCreator.CreateUnion(
  [Recipe, Cook],
  { name: "SearchResult" }
);
