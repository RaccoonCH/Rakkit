import { TypeCreator } from "../../../src";

export enum Difficulty {
  Beginner,
  Easy,
  Medium,
  Hard,
  MasterChef
}

TypeCreator.CreateEnum(Difficulty, {
  name: "Difficulty",
  description: "All possible preparation difficulty levels"
});
