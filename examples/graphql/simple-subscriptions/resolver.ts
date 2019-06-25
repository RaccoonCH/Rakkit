import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Subscription,
  IContext
} from "../../../src";

import { Notification, NotificationPayload } from "./notification.type";

@Resolver()
export class SampleResolver {
  private autoIncrement = 0;

  @Query(returns => Date)
  currentDate() {
    return new Date();
  }

  @Mutation(returns => Boolean)
  async pubSubMutation(
    @Arg("message", { nullable: true })
    message: string | null,
    context: IContext
  ): Promise<boolean> {
    const payload: NotificationPayload = { id: ++this.autoIncrement, message };
    await context.gql.pubSub.publish("NOTIFICATIONS", payload);
    return true;
  }

  @Mutation(returns => Boolean)
  async publisherMutation(
    @Arg("message", { nullable: true })
    message: string | null,
    context: IContext
  ): Promise<boolean> {
    await context.gql.pubSub.publish("NOTIFICATIONS", { id: ++this.autoIncrement, message });
    return true;
  }

  @Subscription({ topics: "NOTIFICATIONS" })
  normalSubscription({ id, message }: NotificationPayload): Notification {
    return { id, message, date: new Date() };
  }

  @Subscription(returns => Notification, {
    topics: "NOTIFICATIONS",
    filter: ({ payload }) => payload.id % 2 === 0
  })
  subscriptionWithFilter({ id, message }: NotificationPayload) {
    const newNotification: Notification = { id, message, date: new Date() };
    return newNotification;
  }

  // dynamic topic

  @Mutation(returns => Boolean)
  async pubSubMutationToDynamicTopic(
    @Arg("topic")
    topic: string,
    @Arg("message", { nullable: true })
    message: string | null,
    context: IContext
  ): Promise<boolean> {
    const payload: NotificationPayload = { id: ++this.autoIncrement, message };
    await context.gql.pubSub.publish(topic, payload);
    return true;
  }

  @Subscription({
    topics: ({ args }) => args.topic
  })
  subscriptionWithFilterToDynamicTopic(
    @Arg("topic") topic: string,
    { id, message }: NotificationPayload,
    context: IContext
  ): Notification {
    return { id, message, date: new Date() };
  }
}
