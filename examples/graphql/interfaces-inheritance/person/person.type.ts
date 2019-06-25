import { ObjectType } from "../../../../src";

import { IPerson } from "./person.interface";

@ObjectType({ implements: IPerson })
export class Person implements IPerson {
  id: string;
  name: string;
  age: number;

  constructor(id: string, name: string, age: number) {
    this.id = id;
    this.name = name;
    this.age = age;
  }
}
