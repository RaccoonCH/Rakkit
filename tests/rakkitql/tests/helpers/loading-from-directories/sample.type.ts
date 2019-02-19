import { Field, ObjectType } from "../../../../../src/modules/rakkitql";

@ObjectType()
export class SampleObject {
  @Field()
  sampleField: string;
}
