import { Field, ObjectType } from "type-graphql";
import { UserModel } from "../user.model";

@ObjectType()
export class GetableUser implements Pick<UserModel, "Id" | "Name" | "Email" | "Role"> {
  @Field()
  Id: number;

  @Field()
  Name: string;

  @Field()
  Email: string;

  @Field()
  Role: string;

  constructor(user: UserModel) {
    this.Id = user.Id;
    this.Name = user.Name;
    this.Email = user.Email;
    this.Role = user.Role;
  }
}
