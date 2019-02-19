import { Query } from "../../../../../src/modules/rakkitql";

import { SampleObject } from "./sample.type";

export class Resolver {
  @Query()
  sampleQuery(): SampleObject {
    return {
      sampleField: "sampleField"
    };
  }
}
