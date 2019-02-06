import { Query, Resolver, FieldResolver, Root, Args, Subscription, PubSub, Info } from "rakkitql";
import { InfoParamMetadata, ParamMetadata } from "rakkitql/dist/metadata/definitions";
import { PubSubEngine } from "graphql-subscriptions";
import { Notif, GetResponse, GetArgs } from "@app/types";
import { TypeormInterface } from "@logic";
import { IContext } from "@types";
import { ExampleModel } from "./Example.model";
import { Auth } from "./Example.before";
import { GraphQLResolveInfo, FieldNode } from "graphql";
import { Entity } from "typeorm";

@Resolver(ExampleModel)
export default class ExampleController {
  private _ormInterface = new TypeormInterface(ExampleModel);

  @Query(returns => ExampleModel, { generic: GetResponse })
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
    }, (Array.from(Array.from(info.fieldNodes)[0].selectionSet.selections)[0] as FieldNode).selectionSet.selections as ReadonlyArray<FieldNode>);
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
