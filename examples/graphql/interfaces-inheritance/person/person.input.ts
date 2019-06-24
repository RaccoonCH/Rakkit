import { InputType, Field } from "../../../../src";

@InputType()
export class PersonInput {
  @Field()
  name: string;

  @Field()
  dateOfBirth: Date;

  constructor(name: string, dateOfBirth: Date) {
    this.name = name;
    this.dateOfBirth = dateOfBirth;
  }
}
