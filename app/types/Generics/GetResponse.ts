import { Field, GenericType, GenericField } from "rakkitql";

@GenericType({ gqlType: "ObjectType" })
export abstract class GetResponse<Type> {
  @Field({ nullable: true })
  readonly count?: number;

  @GenericField({ array: true })
  readonly items: Type[];
}
