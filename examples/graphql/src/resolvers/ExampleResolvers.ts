import { Resolver, Query, Arg, IContext } from "../../../../src";
import { ExampleObjectType, getItems, Response, ExampleInputType, ExampleInputType2 } from "../objects/ExampleObjectType";

const params = getItems(ExampleInputType, ExampleInputType2);

@Resolver()
export class ExampleResolver3 {
  @Query()
  a(
    @Arg(type => params, { nullable: true, flat: true })
    str: Response<ExampleInputType, ExampleInputType2>,
    @Arg({ name: "aaa" })
    aaa: number,
    context: IContext
  ): ExampleInputType {
    console.log(str, aaa, context);
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
