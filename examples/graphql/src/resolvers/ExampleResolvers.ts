import { GoodbyeMiddleware } from "./../../../basic/src/middlewares/GoodbyeMiddleware";
import { HelloMiddleware } from "./../../../basic/src/middlewares/HelloMiddleware";
import {
  Resolver,
  Query,
  Arg,
  IContext,
  UseMiddleware,
  NextFunction,
  Mutation,
  TypeCreator,
  Subscription
} from "../../../../src";
import {
  getItems,
  Response,
  ExampleInputType,
  ExampleInputType2,
  TestEnum,
  MyInterface,
  MyInterfaceObj1
} from "../objects/ExampleObjectType";

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
    const res = new ExampleInputType();
    res.hello3 = "aa";
    res.enumz = TestEnum.a;
    context.gql.response = res;
    console.log(str, stra, aaa);
  }
}

@Resolver()
export class ExampleResolver {
  @Query(type => union)
  async helloWorld(
    context: IContext<ExampleInputType>,
    next: NextFunction
  ) {
    console.log("hello world");
    context.gql.response = {
      enumz: TestEnum.a,
      hello3: "aa"
    };
    await next();
  }

  @Mutation(type => MyInterface)
  async helloWorldMutation(
    context: IContext<MyInterfaceObj1>,
    next: NextFunction
  ) {
    context.gql.pubSub.publish("yo", { payload: "yes" });
    const res: MyInterfaceObj1 = {
      myInterfaceField: "aa",
      yo: "aa"
    };
    context.gql.response = res;
    await next();
  }

  @Subscription({
    topics: "yo"
  })
  sub(
    @Arg({ name: "topic" })
    topic: String,
    payload: any,
    context: IContext,
    next: NextFunction
  ): Boolean {
    console.log(payload, context);
    next();
    return true;
  }
}
