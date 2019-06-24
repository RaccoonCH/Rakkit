import { Field, ObjectType } from "../../../../src";

import { Person } from "../person/person.type";

@ObjectType()
export class Student extends Person {
  @Field()
  universityName: string;

  constructor(
    universityName: string,
    id: string,
    name: string,
    age: number
  ) {
    super(id, name, age);
    this.universityName = universityName;
  }
}
