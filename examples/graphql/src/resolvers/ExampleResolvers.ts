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
  Subscription,
  FieldResolver,
  FlatArgs
} from "../../../../src";
import {
  getItems,
  Response,
  ExampleInputType,
  ExampleInputType2,
  TestEnum,
  MyInterface,
  MyInterfaceObj1,
  ExampleObjectType,
  RequiredExampleInputType
} from "../objects/ExampleObjectType";

const params = getItems(ExampleInputType, ExampleInputType2);

const union = TypeCreator.CreateUnion(
  [ ExampleInputType, ExampleInputType2 ],
  { name: "test" }
);

@Resolver(of => ExampleObjectType)
@UseMiddleware(
  async (context, next) => { console.log("yop"); await next(); },
  async (context, next) => { console.log("bip"); await next(); },
  async (context, next) => { console.log("hip"); await next(); }
)
export class ExampleResolver3 {
  @Query(type => union)
  @UseMiddleware(HelloMiddleware, GoodbyeMiddleware)
  async a(
    @Arg("param0", type => params, { nullable: true })
    str: Response<ExampleInputType, ExampleInputType2>,
    @FlatArgs(type => RequiredExampleInputType)
    stra: Required<ExampleInputType> ,
    @Arg("aa", { defaultValue: 123, description: "yo" })
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

  @FieldResolver(type => String)
  private async aa(
    @Arg("param0")
    param: String,
    context: IContext<String>,
    next: NextFunction
  ) {
    context.gql.response = "a";
    await next();
  }

  @Query(type => [ExampleObjectType])
  private async getAll(
    context: IContext<ExampleObjectType[]>,
    next: NextFunction
   ) {
    const a = new ExampleObjectType();
    const b = new ExampleObjectType();
    a.hello = "a";
    b.hello = "b";
    context.gql.response = [
      a,
      b
    ];
    await next();
  }
}

@Resolver()
export class ExampleResolver {
  @Query(type => [[union]])
  async helloWorld(
    context: IContext<ExampleInputType[][]>,
    next: NextFunction
  ) {
    console.log("hello world");
    context.gql.response = [[{
      enumz: TestEnum.a,
      hello3: "aa"
    }]];
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
    @Arg("topic", type => [[[String]]], {
      description: "yop",
      defaultValue: []
    })
    topic: String,
    payload: any,
    context: IContext,
    next: NextFunction
  ): Boolean {
    console.log(payload, context);
    next();
    return true;
  }

  @Query()
  b(): String {
    return "a";
  }
}
