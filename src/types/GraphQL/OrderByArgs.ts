import { Field, InputType } from "rakkitql";

@InputType()
export abstract class OrderByArgs {
  @Field()
  field: string;

  @Field()
  direction: "DESC" | "ASC";
}
