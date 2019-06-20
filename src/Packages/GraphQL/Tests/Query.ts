// #region Imports
import "reflect-metadata";
import { ApolloServer } from "apollo-server-koa";
import Axios from "axios";
import {
  graphql,
  IntrospectionQuery,
  getIntrospectionQuery,
  IntrospectionObjectType,
  IntrospectionNamedTypeRef,
  GraphQLID
} from "graphql";
import {
  Rakkit,
  ObjectType,
  Field,
  Resolver,
  Query,
  InputType,
  IContext,
  Arg,
  Mutation,
  NextFunction,
  MetadataStorage,
  IClassType,
  FieldResolver
} from "../../..";
import { wait } from "../../Core/Tests/Utils/Waiter";
import { UseMiddleware } from "../../Routing";
import { RouterFirstBeforeMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Router/Before/RouterFirstBeforeMiddleware";
import { RouterSecondBeforeMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Router/Before/RouterSecondBeforeMiddleware";
import { RouterFirstAfterMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Router/After/RouterFirstAfterMiddleware";
import { RouterSecondAfterMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Router/After/RouterSecondAfterMiddleware";
import { EndpointFirstBeforeMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Endpoint/Before/EndpointFirstBeforeMiddleware";
import { EndpointSecondBeforeMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Endpoint/Before/EndpointSecondBeforeMiddleware";
import { EndpointFirstAfterMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Endpoint/After/EndpointFirstAfterMiddleware";
import { EndpointSecondAfterMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Endpoint/After/EndpointSecondAfterMiddleware";
import { GlobalFirstBeforeMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Global/Before/GlobalFirstBeforeMiddleware";
import { GlobalSecondBeforeMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Global/Before/GlobalSecondBeforeMiddleware";
import { GlobalFirstAfterMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Global/After/GlobalFirstAfterMiddleware";
import { GlobalSecondAfterMiddleware } from "../../Core/Tests/ClassesForTesting/Middlewares/Global/After/GlobalSecondAfterMiddleware";
import { ScalarMap, SimpleObjectType } from "./Utils/Classes";
// #endregion

describe("GraphQL", () => {
  afterEach(async () => {
    await Rakkit.stop();
  });

  describe("Query", () => {
    it("Should create a base resolver with inheritance", async () => {
      function createBaseResolver<T extends IClassType>(objectTypeClass: T) {
        @Resolver({ isAbstract: true })
        abstract class BaseResolver {
          protected items: T[] = [];

          @Query(type => String, { name: `getAll${Rakkit.MetadataStorage.Gql.GetOneGqlTypeDef(objectTypeClass).params.name}` })
          getAll() {
            return "all";
          }
        }

        return BaseResolver;
      }

      const myBaseResolver = createBaseResolver(SimpleObjectType);

      @Resolver()
      class InheritanceResolver extends myBaseResolver {
        @Query(type => String)
        getOneSimpleType() {
          return "one";
        }
      }

      await Rakkit.start({ silent: true });

      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const baseResolverIndex = schema.types.findIndex((schemaType) => schemaType.name === "BaseResolver");
      const queryType = (schema.types.find((schemaType) => schemaType.name === "Query") as IntrospectionObjectType);

      expect(baseResolverIndex).toBe(-1);
      expect(queryType.fields.filter(f => ["getAllSimpleType", "getOneSimpleType"].includes(f.name))).toHaveLength(2);
    });

    it("Should create a field resolver with args", async () => {
      @ObjectType()
      class Fieldresolver {
        @Field(type => String, {
          nullable: true
        })
        resolve(
          @Arg({
            defaultValue: "abc",
            description: "arg a",
            name: "first",
            nullable: true
          })
          a: String,
          @Arg({
            defaultValue: 123,
            description: "arg b",
            name: "second",
            nullable: true
          })
          b: Number,
          @Arg(type => [[[String]]], {
            defaultValue: [[[]]],
            description: "arg c",
            name: "third",
            nullable: false,
            arrayNullable: [false, true, false]
          })
          c: string[][][],
          context: IContext
        ): String {
          return a + b.toString();
        }
      }

      await Rakkit.start({ silent: true });
      const schema = (await graphql<IntrospectionQuery>(MetadataStorage.Instance.Gql.Schema, getIntrospectionQuery())).data.__schema;
      const simpleType = schema.types.find((schemaType) => schemaType.name === "Fieldresolver") as IntrospectionObjectType;

      expect(simpleType.fields[0].args).toHaveLength(3);
      expect(simpleType.fields[0].name).toBe("resolve");
      expect((simpleType.fields[0].type as IntrospectionNamedTypeRef).name).toBe("String");

      expect(simpleType.fields[0].args[0].defaultValue).toBe("\"abc\"");
      expect(simpleType.fields[0].args[0].description).toBe("arg a");
      expect(simpleType.fields[0].args[0].name).toBe("first");
      expect((simpleType.fields[0].args[0].type as IntrospectionNamedTypeRef).name).toBe("String");

      expect(simpleType.fields[0].args[1].defaultValue).toBe("123");
      expect(simpleType.fields[0].args[1].description).toBe("arg b");
      expect(simpleType.fields[0].args[1].name).toBe("second");
      expect((simpleType.fields[0].args[1].type as IntrospectionNamedTypeRef).name).toBe("Float");

      expect(simpleType.fields[0].args[2].defaultValue).toBe("[[[]]]");
      expect(simpleType.fields[0].args[2].description).toBe("arg c");
      expect(simpleType.fields[0].args[2].name).toBe("third");
      expect((simpleType.fields[0].args[2].type as any).kind).toBe("NON_NULL");
      expect((simpleType.fields[0].args[2].type as any).ofType.kind).toBe("LIST");
      expect((simpleType.fields[0].args[2].type as any).ofType.ofType.kind).toBe("NON_NULL");
      expect((simpleType.fields[0].args[2].type as any).ofType.ofType.ofType.kind).toBe("LIST");
      expect((simpleType.fields[0].args[2].type as any).ofType.ofType.ofType.ofType.kind).toBe("LIST");
      expect((simpleType.fields[0].args[2].type as any).ofType.ofType.ofType.ofType.ofType.kind).toBe("NON_NULL");
      expect((simpleType.fields[0].args[2].type as any).ofType.ofType.ofType.ofType.ofType.ofType.name).toBe("String");
    });

    it("Should get correct response from resolver (mutation, query and field resolver)", async () => {
      @ObjectType()
      class ResponseItem {
        @Field()
        hello: string;

        constructor(hello: string) {
          this.hello = hello;
        }
      }

      @Resolver(of => ResponseItem)
      class ResolverA {
        @Query(type => String, {
          nullable: true
        })
        resolveA(
          @Arg({
            name: "first",
            nullable: true
          })
          a: string
        ): String {
          return a;
        }

        @FieldResolver()
        dynamicField(
          @Arg()
          param: string,
          context: IContext
        ): string {
          return param + context.gql.root.hello;
        }

        @Query(type => [ResponseItem])
        getAll(): ResponseItem[] {
          return [
            new ResponseItem("a"),
            new ResponseItem("b")
          ];
        }
      }

      @Resolver()
      class ResolverB {
        @Query(type => String, {
          nullable: true,
          name: "resolveB"
        })
        async resolve(
          @Arg({ name: "second" })
          b: string,
          context: IContext<String>
        ) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          context.gql.response = `hello ${b}`;
        }
      }

      @Resolver()
      class ResolverC {
        @Mutation(type => String, {
          nullable: true,
          name: "resolveC"
        })
        async resolve(
          @Arg({ name: "second" })
          c: string,
          context: IContext<String>
        ) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          context.response.body = `${c} world`;
        }
      }

      await Rakkit.start({
        forceStart: ["rest", "gql"]
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
        query: 'query { resolveA(first: "hello world") }'
      });
      const resB = await Axios.post("http://localhost:4000/graphql", {
        query: 'query { resolveB(second: "world") }'
      });
      const resC = await Axios.post("http://localhost:4000/graphql", {
        query: 'mutation { resolveC(second: "hello") }'
      });
      const resD = await Axios.post("http://localhost:4000/graphql", {
        query: 'query { getAll { dynamicField(param0: "hello") } }'
      });

      expect(resA.data.data).toEqual({
        resolveA: "hello world"
      });
      expect(resB.data.data).toEqual({
        resolveB: "hello world"
      });
      expect(resC.data.data).toEqual({
        resolveC: "hello world"
      });
      expect(resD.data.data.getAll).toEqual([
        { dynamicField: "helloa" },
        { dynamicField: "hellob" }
      ]);
    });

    describe("Middlewares", () => {
      it("Should pass middlewares with correct order", async () => {
        @Resolver()
        @UseMiddleware(
          RouterFirstBeforeMiddleware,
          RouterSecondBeforeMiddleware,
          RouterFirstAfterMiddleware,
          RouterSecondAfterMiddleware
        )
        class MiddlewareResolver {
          @Query(type => String)
          @UseMiddleware(
            EndpointFirstBeforeMiddleware,
            EndpointSecondBeforeMiddleware,
            EndpointFirstAfterMiddleware,
            EndpointSecondAfterMiddleware
          )
          async queryMiddleware(context: IContext, next: NextFunction) {
            await wait();
            context.body += "0;";
            await next();
          }
        }

        await Rakkit.start({
          forceStart: ["rest", "gql"],
          gql: {
            scalarsMap: [
              { type: ScalarMap, scalar: GraphQLID }
            ],
            globalMiddlewares: [
              GlobalFirstBeforeMiddleware,
              GlobalSecondBeforeMiddleware,
              GlobalFirstAfterMiddleware,
              GlobalSecondAfterMiddleware
            ]
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

        const res = await Axios.post("http://localhost:4000/graphql", {
          query: "query { queryMiddleware }"
        });

        expect(res.data.data.queryMiddleware).toBe("gb1;gb2;rb1;rb2;eb1;eb2;0;ea1;ea2;ra1;ra2;ga1;ga2;");
      });
    });

    describe("Args parsing", () => {
      it("Should parse defined args type (flat and not flat)", async () => {
        @InputType()
        class InputArgs {
          @Field()
          name: string;
        }

        const responses: {
          arg: InputArgs,
          arg2: string,
          arg3: number,
          ctx: IContext,
          next: NextFunction
        }[] = [];

        @Resolver()
        class ArgsParsingResolver {
          @Query()
          parseArgs(
            @Arg(type => [[InputArgs]], { name: "arg" })
            arg: [[InputArgs]],
            @Arg({ name: "arg2" })
            arg2: string,
            @Arg({ name: "arg3", nullable: true })
            arg3: number,
            ctx: IContext,
            next: NextFunction
          ): string {
            responses.push({
              arg: arg[0][0],
              arg2,
              arg3,
              ctx,
              next
            });
            return "done";
          }

          @Query()
          parseArgsFlat(
            @Arg({ name: "arg", flat: true })
            arg: InputArgs,
            @Arg({ name: "arg2" })
            arg2: string,
            @Arg({ name: "arg3", nullable: true })
            arg3: number,
            ctx: IContext,
            next: NextFunction
          ): string {
            responses.push({
              arg,
              arg2,
              arg3,
              ctx,
              next
            });
            return "done";
          }
        }

        await Rakkit.start({
          forceStart: ["rest", "gql"]
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

        await Axios.post("http://localhost:4000/graphql", {
          query: 'query { parseArgs(arg: [[{name: "hello"}]], arg2: "hello2") }'
        });

        await Axios.post("http://localhost:4000/graphql", {
          query: 'query { parseArgsFlat(name: "hello", arg2: "hello2") }'
        });

        for (const res of responses) {
          expect(res.arg).toBeInstanceOf(InputArgs);
          expect(res.arg.name).toBe("hello");
          expect(res.arg2).toBe("hello2");
          expect(res.arg3).toBe(undefined);
          expect(res.ctx.gql).not.toBe(undefined);
          expect(res.next).not.toBe(undefined);
        }
      });
    });
  });
});
