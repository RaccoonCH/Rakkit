import { Field, ObjectType } from "../../../../../../src/modules/rakkitql";

import { CircularRef2 } from "./CircularRef2";

@ObjectType()
export class CircularRef1 {
  @Field()
  ref2Field: CircularRef2;
}
