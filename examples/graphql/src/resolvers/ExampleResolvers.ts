import { Resolver, Query, Args, FlatArgs } from "../../../../src";
import { ExampleObjectType, ExampleInputType } from "../objects/ExampleObjectType";

@Resolver()
export class ExampleResolver {
  @Query()
  helloWorld(
    context
  ): String {
    ExampleObjectType;
    console.log("hello world");
    return "aass";
  }
}

@Resolver()
export class ExampleResolver3 {
  @Query()
  helloWorlsd(
    @Args()
    args: ExampleInputType,
    context
  ): ExampleObjectType {
    ExampleObjectType;
    console.log("hello world");
    return;
  }
}
