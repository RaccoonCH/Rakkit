import { Resolver, Query, Arg } from "../../../../src";
import { ExampleObjectType, getItems, Response, ExampleInputType, ExampleInputType2 } from "../objects/ExampleObjectType";

const params = getItems(ExampleInputType, ExampleInputType2);

@Resolver()
export class ExampleResolver3 {
  @Query()
  a(
    @Arg(type => params, {
      nullable: true
    })
    str: Response<ExampleInputType, ExampleInputType2>,
    @Arg()
    aaa: number,
    context
  ): ExampleObjectType {
    ExampleObjectType;
    console.log("hello world");
    return;
  }
}

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
