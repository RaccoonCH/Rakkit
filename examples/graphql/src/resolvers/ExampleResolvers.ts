import { GoodbyeMiddleware } from "./../../../basic/src/middlewares/GoodbyeMiddleware";
import { HelloMiddleware } from "./../../../basic/src/middlewares/HelloMiddleware";
import { Resolver, Query, Arg, IContext, UseMiddleware } from "../../../../src";
import { ExampleObjectType, getItems, Response, ExampleInputType, ExampleInputType2 } from "../objects/ExampleObjectType";

const params = getItems(ExampleInputType, ExampleInputType2);

@Resolver()
@UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
export class ExampleResolver3 {
  @Query()
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
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
@UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
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
