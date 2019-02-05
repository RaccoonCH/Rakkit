import { Query, Resolver, FieldResolver, Root, Args, Subscription, PubSub } from "type-graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { OrmInterface } from "@logic";
import { ExampleGetResponse, Notif, ExampleArgs } from "./Types";
import {ExampleModel } from "./Example.model";

@Resolver(ExampleModel)
export default class ExampleController {
  private _ormInterface = new OrmInterface(ExampleModel);

  @Query(returns => ExampleGetResponse)
  async examples(@Args() args: ExampleArgs) {
    return this._ormInterface.GetManyAndCount(args);
  }

  @Query(returns => String)
  async hello(@PubSub() pubSub: PubSubEngine) {
    await pubSub.publish("EXAMPLE_SUB", {});
    return "okay";
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
  nameToUppercase(@Root() exampleInstance: ExampleModel): string {
    return exampleInstance.Name.toLocaleUpperCase();
  }
}
