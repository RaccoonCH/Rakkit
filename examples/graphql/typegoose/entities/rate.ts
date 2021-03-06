import { ObjectType, Field, Int } from "../../../../src";
import { prop as Property, Ref } from "typegoose";

import { User } from "./user";
import { ObjectId } from "mongodb";

@ObjectType()
export class Rate {
  @Field({ nullable: true })
  readonly _id?: ObjectId;

  @Field(type => Int)
  @Property({ required: true })
  value: number;

  @Field()
  @Property({ default: new Date(), required: true })
  date: Date;

  @Field(type => User)
  @Property({ ref: User, required: true })
  user: Ref<User>;
}
