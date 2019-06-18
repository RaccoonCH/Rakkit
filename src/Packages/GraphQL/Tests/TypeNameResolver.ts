// #region Imports
import "reflect-metadata";
import { ApolloServer } from "apollo-server-koa";
import Axios from "axios";
import {
  GraphQLID
} from "graphql";
import {
  Rakkit,
  ObjectType,
  Field,
  Resolver,
  Query,
  Arg,
  InterfaceType,
  TypeCreator,
  MetadataStorage
} from "../../..";
import { ScalarMap } from "./Utils/Classes";
// #endregion

describe("GraphQL", () => {
  afterEach(async () => {
    await Rakkit.stop();
  });

  describe("__typename resolver", () => {
    it("Should resolve the correct type of an interface implementation (safely and unsafely)", async () => {
      @InterfaceType()
      class ResolveInterface {
        @Field()
        interfaceField: string;
      }

      @ObjectType({
        implements: ResolveInterface
      })
      class ResolveInterfaceOne implements ResolveInterface {
        @Field()
        interfaceField: string;

        @Field()
        interfaceFieldOne: string;
      }

      @ObjectType({
        implements: ResolveInterface
      })
      class ResolveInterfaceTwo implements ResolveInterface {
        @Field()
        interfaceField: string;

        @Field()
        interfaceFieldTwo: string;
      }

      @Resolver()
      class ResolverResolveInterfaceType {
        @Query({
          nullable: true
        })
        resolveSafelyInterfaceType(
          @Arg({ name: "interface" })
          a: Boolean
        ): ResolveInterface {
          return a ? new ResolveInterfaceOne() : new ResolveInterfaceTwo();
        }

        @Query({
          nullable: true
        })
        resolveUnsafelyInterfaceType(
          @Arg({ name: "interface" })
          a: Boolean
        ): ResolveInterface {
          let returnObj: (ResolveInterfaceOne | ResolveInterfaceTwo) = {
            interfaceField: "a",
            interfaceFieldOne: "a"
          };
          if (!a) {
            returnObj = {
              interfaceField: "a",
              interfaceFieldTwo: "a"
            };
          }
          return returnObj;
        }
      }

      await Rakkit.start({
        forceStart: ["rest", "gql"],
        silent: true,
        gql: {
          scalarMap: [
            [ScalarMap, GraphQLID]
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
      server.applyMiddleware({
        app: Rakkit.Instance.KoaApp
      });

      const resA = await Axios.post("http://localhost:4000/graphql", {
        query: "query { resolveSafelyInterfaceType(interface: true) { __typename } }"
      });
      const resB = await Axios.post("http://localhost:4000/graphql", {
        query: "query { resolveSafelyInterfaceType(interface: false) { __typename } }"
      });

      const resC = await Axios.post("http://localhost:4000/graphql", {
        query: "query { resolveUnsafelyInterfaceType(interface: true) { __typename } }"
      });
      const resD = await Axios.post("http://localhost:4000/graphql", {
        query: "query { resolveUnsafelyInterfaceType(interface: false) { __typename } }"
      });

      expect(resA.data.data.resolveSafelyInterfaceType.__typename).toBe("ResolveInterfaceOne");
      expect(resB.data.data.resolveSafelyInterfaceType.__typename).toBe("ResolveInterfaceTwo");

      expect(resC.data.data.resolveUnsafelyInterfaceType.__typename).toBe("ResolveInterfaceOne");
      expect(resD.data.data.resolveUnsafelyInterfaceType.__typename).toBe("ResolveInterfaceTwo");
    });

    it("Should resolve the correct type of an iunion type (safely and unsafely)", async () => {
      @ObjectType()
      class ResolveUnionOne {
        @Field()
        unionField: string;

        @Field()
        unionFieldOne: string;
      }

      @ObjectType()
      class ResolveUnionTwo {
        @Field()
        unionField: string;

        @Field()
        unionFieldTwo: string;
      }

      const resolveUnion = TypeCreator.CreateUnion([ResolveUnionOne, ResolveUnionTwo]);

      @Resolver()
      class ResolverResolveUnionType {
        @Query(type => resolveUnion, {
          nullable: true
        })
        resolveSafelyUnionType(
          @Arg({ name: "union" })
          a: Boolean
        ): ResolveUnionOne | ResolveUnionTwo {
          return a ? new ResolveUnionOne() : new ResolveUnionTwo();
        }

        @Query(type => resolveUnion, {
          nullable: true
        })
        resolveUnsafelyUnionType(
          @Arg({ name: "union" })
          a: Boolean
        ): ResolveUnionOne | ResolveUnionTwo {
          let returnObj: (ResolveUnionOne | ResolveUnionTwo) = {
            unionField: "a",
            unionFieldOne: "a"
          };
          if (!a) {
            returnObj = {
              unionField: "a",
              unionFieldTwo: "a"
            };
          }
          return returnObj;
        }
      }

      await Rakkit.start({
        forceStart: ["rest", "gql"],
        silent: true,
        gql: {
          scalarMap: [
            [ScalarMap, GraphQLID]
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
      server.applyMiddleware({
        app: Rakkit.Instance.KoaApp
      });

      const resA = await Axios.post("http://localhost:4000/graphql", {
        query: "query { resolveSafelyUnionType(union: true) { __typename } }"
      });
      const resB = await Axios.post("http://localhost:4000/graphql", {
        query: "query { resolveSafelyUnionType(union: false) { __typename } }"
      });

      const resC = await Axios.post("http://localhost:4000/graphql", {
        query: "query { resolveUnsafelyUnionType(union: true) { __typename } }"
      });
      const resD = await Axios.post("http://localhost:4000/graphql", {
        query: "query { resolveUnsafelyUnionType(union: false) { __typename } }"
      });

      expect(resA.data.data.resolveSafelyUnionType.__typename).toBe("ResolveUnionOne");
      expect(resB.data.data.resolveSafelyUnionType.__typename).toBe("ResolveUnionTwo");

      expect(resC.data.data.resolveUnsafelyUnionType.__typename).toBe("ResolveUnionOne");
      expect(resD.data.data.resolveUnsafelyUnionType.__typename).toBe("ResolveUnionTwo");
    });
  });
});
