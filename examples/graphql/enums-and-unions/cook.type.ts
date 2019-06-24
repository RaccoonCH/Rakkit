import { Field, ObjectType, Int } from "../../../src";

@ObjectType()
export class Cook {
  @Field()
  name: string;

  @Field(type => Int)
  yearsOfExperience: number;

  constructor(name: string, yearsOfExperience: number) {
    this.name = name;
    this.yearsOfExperience = yearsOfExperience;
  }
}
