import { Field, GenericType, GenericField } from "rakkitql";

@GenericType({ gqlType: "ObjectType" })
export abstract class GetResponse<Type> {
  @Field()
  readonly count: number;

  @GenericField({ array: true })
  readonly items: Type[];
}
