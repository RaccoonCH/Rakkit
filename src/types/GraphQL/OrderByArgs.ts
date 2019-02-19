import { Field, InputType } from "../../modules/rakkitql";

@InputType()
export abstract class OrderByArgs {
  @Field()
  field: string;

  @Field()
  direction: "DESC" | "ASC";
}
