import { Resolver, Query } from "../../../../src";

@Resolver()
export class ExampleResolver {
  @Query()
  helloWorld() {
    console.log("hello world");
  }
}
