// tslint:disable-next-line:max-line-length
import { Query, Resolver, FieldResolver, Root, Args, Subscription, PubSub, Info, MiddlewareInterface, UseMiddleware } from "rakkitql";
import { PubSubEngine } from "graphql-subscriptions";
import { Notif, GetResponse, GetArgs } from "@app/types";
import { TypeormInterface } from "@logic";
import { ExampleModel } from "./Example.model";
import { GraphQLResolveInfo, FieldNode } from "graphql";
import { BeforeMiddleware, AfterMiddleware } from "@decorators";
import { BaseMiddleware, IContext } from "@types";

@BeforeMiddleware()
export class Before extends BaseMiddleware {
  async use(ctx: IContext, next) {
    console.log(ctx, "Before");
    return next();
  }
}

@Resolver(ExampleModel)
export default class ExampleController {
  private _ormInterface = new TypeormInterface(ExampleModel);

  @Query(returns => ExampleModel, { generic: GetResponse })
  @UseMiddleware(Before)
  async examples(
    @Args({ type: ExampleModel }) args: GetArgs<ExampleModel>,
    @Info() info: GraphQLResolveInfo
  ) {
    info;
    return this._ormInterface.Query({
      ...args,
      relations: [
        {
          table: "test",
          forArg: "test",
          select: true
        }
      ]
    }, info);
  }

  @Query(returns => String)
  @UseMiddleware(Before)
  async hello(@PubSub() pubSub: PubSubEngine, next) {
    await pubSub.publish("EXAMPLE_SUB", {});
    console.log("func");
    next();
    return "hellooo";
  }

  @Subscription({
    topics: "EXAMPLE_SUB"
  })
  exampleSub(@Root() notificationPayload: Object): Notif {
    return {
      date: new Date()
    };
  }

  // The @Root refers to the self element instance
  @FieldResolver()
  @UseMiddleware(Before)
  nameToUppercase(@Root() exampleInstance: ExampleModel, next): string {
    return exampleInstance.Name.toLocaleUpperCase();
  }
}
