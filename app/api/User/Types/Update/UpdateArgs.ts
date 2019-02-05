import { ArgsType, Field } from "type-graphql";
import { RegisterArgs } from "../Register/RegisterArgs";
import { UserModel } from "../../user.model";

@ArgsType()
export class UpdateArgs extends RegisterArgs implements Pick<UserModel, "Id" | "Role"> {
  @Field()
  Id: number;

  @Field()
  Role: string;
}
