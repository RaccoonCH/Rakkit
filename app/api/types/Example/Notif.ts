import { ObjectType, Field } from "rakkitql";

@ObjectType()
export class Notif {
  @Field()
  date: Date;
}
