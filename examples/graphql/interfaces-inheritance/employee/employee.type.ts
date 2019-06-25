import { Field, ObjectType } from "../../../../src";

import { Person } from "../person/person.type";

@ObjectType()
export class Employee extends Person {
  @Field()
  companyName: string;

  constructor(companyName: string, id: string, name: string, age: number) {
    super(id, name, age);
    this.companyName = companyName;
  }
}
