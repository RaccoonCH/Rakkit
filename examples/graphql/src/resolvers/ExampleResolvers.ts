import { GoodbyeMiddleware } from "./../../../basic/src/middlewares/GoodbyeMiddleware";
import { HelloMiddleware } from "./../../../basic/src/middlewares/HelloMiddleware";
import { Resolver, Query, Arg, IContext, UseMiddleware, NextFunction, Mutation, MetadataStorage, TypeCreator } from "../../../../src";
import { ExampleObjectType, getItems, Response, ExampleInputType, ExampleInputType2, ExampleObjectType2 } from "../objects/ExampleObjectType";

const params = getItems(ExampleInputType, ExampleInputType2);

const union = TypeCreator.CreateUnion(
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
  @Query(type => union)
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
  async a(
    @Arg(type => params, { nullable: true, flat: true })
    str: Response<ExampleInputType, ExampleInputType2>,
    @Arg({ nullable: true, name: "zzz", flat: true })
    stra: ExampleInputType2,
    @Arg({ name: "aa" })
    aaa: number,
    context: IContext<ExampleInputType | ExampleInputType2>,
    next: NextFunction
  ) {
    await next();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    context.gqlResponse.hello3 = "yop";
    console.log(str, stra, aaa);
  }
}

@Resolver()
@UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
export class ExampleResolver {
  @Query(type => ExampleInputType)
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
