import { Field, GenericType, GenericField } from "../../../modules/rakkitql";

@GenericType({
  gqlType: "ObjectType",
  transformFields: {
    nullable: true
  }
})
export abstract class GetResponse<Type> {
  @Field({ nullable: true })
  readonly count?: number;

  @GenericField({ array: true, nullable: true })
  readonly items?: Type[];
}
