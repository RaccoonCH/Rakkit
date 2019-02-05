import { ArgsType, Field } from "type-graphql";
import { UserModel } from "../../user.model";

@ArgsType()
export class LoginArgs implements Pick<UserModel, "Name" | "Password"> {
  @Field()
  Name: string;

  @Field()
  Password: string;
}
