import { Resolver, Query } from "../../../../src";
import { ExampleObjectType } from "../objects/ExampleObjectType";

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
