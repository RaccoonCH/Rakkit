import { Resolver, Query, Arg, Mutation } from "../../../src";

import { getId, calculateAge } from "./helpers";
import { Student } from "./student/student.type";
import { Employee } from "./employee/employee.type";
import { StudentInput } from "./student/student.input";
import { EmployeeInput } from "./employee/employee.input";
import { IPerson } from "./person/person.interface";

@Resolver()
export class MultiResolver {
  private readonly personsRegistry: IPerson[] = [];

  @Query(returns => [IPerson])
  persons(): IPerson[] {
    // this one returns interfaces
    // so GraphQL has to be able to resolve type of the item
    return this.personsRegistry;
  }

  @Mutation()
  addStudent(@Arg("input") input: StudentInput): Student {
    // be sure to create real instances of classes
    const student = new Student(
      input.universityName,
      getId(),
      input.name,
      calculateAge(input.dateOfBirth)
    );
    this.personsRegistry.push(student);
    return student;
  }

  @Mutation()
  addEmployee(@Arg("input") input: EmployeeInput): Employee {
    const employee = new Employee(
      input.companyName,
      getId(),
      input.name,
      calculateAge(input.dateOfBirth)
    );
    this.personsRegistry.push(employee);
    return employee;
  }
}
