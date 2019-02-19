import { Field, GenericType, GenericField } from "../../../modules/rakkitql";
import { OrderByArgs } from "../..";

@GenericType({
  transformFields: { nullable: true }
})
export abstract class GetArgs<Type> {
  @GenericField({ nullable: true })
  readonly where?: Type;

  @Field({ nullable: true })
  readonly count?: boolean;

  @Field({ nullable: true })
  readonly skip?: number;

  @Field({ nullable: true })
  readonly limit?: number;

  @Field({ nullable: true })
  readonly last?: number;

  @Field({ nullable: true })
  readonly first?: number;

  @Field({ nullable: true })
  readonly conditionOperator?: "or" | "and";

  @Field(type => OrderByArgs, { nullable: true })
  readonly orderBy?: OrderByArgs;
}
