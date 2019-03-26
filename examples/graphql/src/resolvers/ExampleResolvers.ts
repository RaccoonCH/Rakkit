import { GoodbyeMiddleware } from "./../../../basic/src/middlewares/GoodbyeMiddleware";
import { HelloMiddleware } from "./../../../basic/src/middlewares/HelloMiddleware";
import { Resolver, Query, Arg, IContext, UseMiddleware, NextFunction, Mutation, MetadataStorage } from "../../../../src";
import { ExampleObjectType, getItems, Response, ExampleInputType, ExampleInputType2, ExampleObjectType2 } from "../objects/ExampleObjectType";

const params = getItems(ExampleInputType, ExampleInputType2);
const partialType = MetadataStorage.Instance.Gql.CreatePartial(
  ExampleInputType,
  "ObjectType"
);

@Resolver()
@UseMiddleware(
  async (context, next) => { console.log("yo"); await next(); },
  async (context, next) => { console.log("bye"); await next(); },
  async (context, next) => { console.log("hi"); await next(); }
)
export class ExampleResolver3 {
  @Query(returns => partialType)
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
  @Query()
  helloWorld(
    context
  ): String {
    ExampleObjectType;
    console.log("hello world");
    return "aass";
  }

  @Mutation()
  helloWorldMutation(
    context
  ): String {
    ExampleObjectType;
    console.log("hello world");
    return "aass";
  }
}
