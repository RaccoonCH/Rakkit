import { GoodbyeMiddleware } from "./../../../basic/src/middlewares/GoodbyeMiddleware";
import { HelloMiddleware } from "./../../../basic/src/middlewares/HelloMiddleware";
import { Resolver, Query, Arg, IContext, UseMiddleware, NextFunction, Mutation, MetadataStorage } from "../../../../src";
import { ExampleObjectType, getItems, Response, ExampleInputType, ExampleInputType2, ExampleObjectType2 } from "../objects/ExampleObjectType";

const params = getItems(ExampleInputType, ExampleInputType2);

enum Test {
  a = "a",
  b = "b"
}

const enumType = MetadataStorage.Instance.Gql.CreateEnum(Test, { name: "testenum" });
const union = MetadataStorage.Instance.Gql.CreateUnion(
  { name: "test" },
  ExampleInputType, ExampleInputType2
);

@Resolver()
@UseMiddleware(
  async (context, next) => { console.log("yo"); await next(); },
  async (context, next) => { console.log("bye"); await next(); },
  async (context, next) => { console.log("hi"); await next(); }
)
export class ExampleResolver3 {
  @Query(type => enumType)
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
  async a(
    @Arg(type => params, { nullable: true, flat: true })
    str: Response<ExampleInputType, ExampleInputType2>,
    @Arg({ nullable: true, name: "zzz", flat: true })
    stra: ExampleInputType2,
    @Arg({ name: "aa" })
    aaa: number,
    context: IContext<ExampleObjectType>,
    next: NextFunction
  ) {
    await next();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    context.gqlResponse.hello = "b";
    console.log(str, aaa);
  }
}

@Resolver()
@UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
export class ExampleResolver {
  @Query(type => union)
  helloWorld(
    context
  ): String {
    console.log("hello world");
    return "hello";
  }

  @Mutation()
  helloWorldMutation(
    context
  ): String {
    console.log("hello world");
    return "hello";
  }
}
