import { ArgsType, Field, InputType } from "type-graphql";
import { GraphqlUtils } from "@logic";
import { UserModel } from "../user.model";

@InputType()
export class UserType implements Pick<UserModel, "Id" | "Name" | "Email" | "Role"> {
  @Field({ nullable: true })
  readonly Id: number;

  @Field({ nullable: true })
  readonly Name: string;

  @Field({ nullable: true })
  readonly Email: string;

  @Field({ nullable: true })
  readonly Role: string;
}

@ArgsType()
export class UserArgs extends GraphqlUtils.createArgsClass(UserType) {}
