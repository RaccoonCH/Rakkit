import { InputType, Field } from "../../../../src";

import { PersonInput } from "../person/person.input";

@InputType()
export class EmployeeInput extends PersonInput {
  @Field()
  companyName: string;

  constructor(companyName: string, name: string, dateOfBirth: Date) {
    super(name, dateOfBirth);
    this.companyName = companyName;
  }
}
