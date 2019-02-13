import {
  Query,
  Resolver,
  FieldResolver,
  Root,
  Args,
  Subscription,
  PubSub,
  Info,
  UseMiddleware
} from "rakkitql";
import { PubSubEngine } from "graphql-subscriptions";
import { Notif, GetResponse, GetArgs } from "@app/types";
import { TypeormInterface } from "@logic";
import { ExampleModel } from "./Example.model";
import { GraphQLResolveInfo } from "graphql";
import { Before } from "./Example.before";
import { NextFunction } from "@types";
import { After } from "./Example.after";

@Resolver(ExampleModel)
export class ExampleController {
  private _ormInterface = new TypeormInterface(ExampleModel);

  @FieldResolver(type => String)
  async example(
    @Root() root: ExampleModel
  ) {
    root;
    return "yo";
  }

  @Query(returns => ExampleModel, { generic: GetResponse })
  @UseMiddleware(Before)
  async examples(
    @Args({ type: ExampleModel }) args: GetArgs<ExampleModel>,
    @Info() info: GraphQLResolveInfo
  ) {
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
  @UseMiddleware(Before, After)
  async hello(@PubSub() pubSub: PubSubEngine, next: NextFunction) {
    await pubSub.publish("EXAMPLE_SUB", {});
    next();
    return "hello";
  }

  @Subscription({
    topics: "EXAMPLE_SUB"
  })
  exampleSub(@Root() notificationPayload: Object): Notif {
    return {
      date: new Date()
    };
  }

  @FieldResolver()
  @UseMiddleware(Before)
  nameToUppercase(@Root() exampleInstance: ExampleModel, next): string {
    return exampleInstance.Name.toLocaleUpperCase();
  }
}
