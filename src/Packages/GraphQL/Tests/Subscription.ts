// #region Imports
import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server-koa";
import Fetch from "node-fetch";
import {
  GraphQLID
} from "graphql";
import {
  Rakkit,
  Resolver,
  Query,
  IContext,
  Arg,
  NextFunction,
  MetadataStorage
} from "../../..";
import { Subscription } from "../Decorator/Decorators/Query/Subscription";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import * as ws from "ws";
import {
  ScalarMap
} from "./Utils/Classes";
// #endregion

describe("GraphQL", () => {
  afterEach(async () => {
    await Rakkit.stop();
  });

  describe("Subscriptions", () => {
    it("Should create a subscription", async () => {
      const subRes: string[] = [];
      @Resolver()
      class SubscriptionResolver {
        @Query({ nullable: true })
        activeSub(
          @Arg("topic")
          topic: string,
          context: IContext
        ): string {
          context.gql.pubSub.publish(topic, "test");
          return "okay";
        }

        @Subscription({
          topics: ({ args }) => args.topic
        })
        sub(
          @Arg("topic")
          topic: string,
          payload: string,
          ctx: IContext,
          next: NextFunction
        ) {
          subRes.push(topic + payload);
        }
      }

      await Rakkit.start({
        forceStart: ["rest", "gql"],
        silent: true,
        gql: {
          scalarsMap: [
            { type: ScalarMap, scalar: GraphQLID }
          ],
          globalMiddlewares: []
        }
      });

      const server = new ApolloServer({
        schema: MetadataStorage.Instance.Gql.Schema,
        context: ({ctx}) => ({
          ...ctx
        })
      });
      server.installSubscriptionHandlers(Rakkit.Instance.HttpServer);
      server.applyMiddleware({
        app: Rakkit.Instance.KoaApp
      });

      const httpLink = new HttpLink({
        uri: "http://localhost:4000/graphql",
        fetch: Fetch
      });

      const getQuery = (topic: string) => {
        return {
          query: gql`
            query {
              activeSub(topic: "${topic}")
            }
          `
        };
      };

      const wsLink = new WebSocketLink({
        uri: "ws://localhost:4000/graphql",
        options: {
          connectionCallback: () => {
            client.query(getQuery("hello"));
          }
        },
        webSocketImpl: ws
      });

      const link = split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return def.kind === "OperationDefinition" && def.operation === "subscription";
        },
        wsLink,
        httpLink
      );

      const client = new ApolloClient({
        link,
        cache: new InMemoryCache()
      });

      await new Promise((resolve) => {
        client.subscribe({
          query: gql`subscription {
            sub(topic: "hello")
          }`
        }).subscribe(resolve);
      });

      await server.stop();
      await client.stop();

      expect(subRes).toEqual(["hellotest"]);
    });

    it("Should create a subscription with custum subscription", async () => {
      const subRes: string[] = [];
      @Resolver()
      class SubscriptionResolver {
        @Query({ nullable: true })
        activeSubCustom(
          @Arg("topic")
          topic: string,
          context: IContext
        ): string {
          context.gql.pubSub.publish(topic, "test");
          return "okay";
        }

        @Subscription({
          subscribe: ({args, pubSub}) => {
            return pubSub.asyncIterator("hello2");
          }
        })
        subCustom(
          payload: string,
          ctx: IContext,
          next: NextFunction
        ) {
          subRes.push(`hello2${payload}`);
        }
      }

      await Rakkit.start({
        forceStart: ["rest", "gql"],
        silent: true,
        gql: {
          scalarsMap: [
            { type: ScalarMap, scalar: GraphQLID }
          ],
          globalMiddlewares: []
        }
      });

      const server = new ApolloServer({
        schema: MetadataStorage.Instance.Gql.Schema,
        context: ({ctx}) => ({
          ...ctx
        })
      });
      server.installSubscriptionHandlers(Rakkit.Instance.HttpServer);
      server.applyMiddleware({
        app: Rakkit.Instance.KoaApp
      });

      const httpLink = new HttpLink({
        uri: "http://localhost:4000/graphql",
        fetch: Fetch
      });

      const getQuery = (topic: string) => {
        return {
          query: gql`
            query {
              activeSub(topic: "${topic}")
            }
          `
        };
      };

      const wsLink = new WebSocketLink({
        uri: "ws://localhost:4000/graphql",
        options: {
          connectionCallback: () => {
            client.query(getQuery("hello2"));
          }
        },
        webSocketImpl: ws
      });

      const link = split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return def.kind === "OperationDefinition" && def.operation === "subscription";
        },
        wsLink,
        httpLink
      );

      const client = new ApolloClient({
        link,
        cache: new InMemoryCache()
      });

      await new Promise((resolve) => {
        client.subscribe({
          query: gql`subscription {
            subCustom
          }`
        }).subscribe(resolve);
      });

      await server.stop();
      await client.stop();

      expect(subRes).toEqual(["hello2test"]);
    });

    it("Should create a subscription with custum subscription", async () => {
      const subRes: string[] = [];

      // tslint:disable-next-line:prefer-const
      let ok = false;

      @Resolver()
      class SubscriptionResolver {
        @Query({ nullable: true })
        activeSubCustom(
          @Arg("topic")
          topic: string,
          context: IContext
        ): string {
          context.gql.pubSub.publish(topic, "test");
          return "okay";
        }

        @Subscription({
          topics: ({ args }) => args.topic,
          filter: async ({ args }) => {
            ok = true;
            return !["yo"].includes(args.topic);
          }
        })
        subFilter(
          @Arg("topic")
          topic: string,
          payload: string,
          ctx: IContext,
          next: NextFunction
        ) {
          subRes.push(topic + payload);
        }
      }

      await Rakkit.start({
        forceStart: ["rest", "gql"],
        silent: true,
        gql: {
          scalarsMap: [
            { type: ScalarMap, scalar: GraphQLID }
          ],
          globalMiddlewares: []
        }
      });

      const server = new ApolloServer({
        schema: MetadataStorage.Instance.Gql.Schema,
        context: ({ctx}) => ({
          ...ctx
        })
      });
      server.installSubscriptionHandlers(Rakkit.Instance.HttpServer);
      server.applyMiddleware({
        app: Rakkit.Instance.KoaApp
      });

      const httpLink = new HttpLink({
        uri: "http://localhost:4000/graphql",
        fetch: Fetch
      });

      const getQuery = (topic: string) => {
        return {
          query: gql`
            query {
              activeSub(topic: "${topic}")
            }
          `
        };
      };

      const wsLink = new WebSocketLink({
        uri: "ws://localhost:4000/graphql",
        options: {
          connectionCallback: () => {
            client.query(getQuery("yo"));
            client.query(getQuery("hello3"));
          }
        },
        webSocketImpl: ws
      });

      const link = split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return def.kind === "OperationDefinition" && def.operation === "subscription";
        },
        wsLink,
        httpLink
      );

      const client = new ApolloClient({
        link,
        cache: new InMemoryCache()
      });

      await new Promise((resolve) => {
        client.subscribe({
          query: gql`subscription {
            subFilter(topic: "yo")
          }`
        }).subscribe(() => {});

        client.subscribe({
          query: gql`subscription {
            subFilter(topic: "hello3")
          }`
        }).subscribe(resolve);
      });

      await server.stop();
      await client.stop();

      expect(subRes).toEqual(["hello3test"]);
      expect(ok).toEqual(true);
    });
  });
});
