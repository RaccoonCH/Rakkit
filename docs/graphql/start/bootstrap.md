---
title: Bootstrapping
---

# Bootstraping

After creating our resolvers, type classes, and other business-related code, we need to make our app run. First we have to build the schema, then we can expose it with an HTTP server, WebSockets or even MQTT.

## Create Executable Schema

To create an executable schema from type and resolver definitions, we need to use the `Rakkit.start` method.
It takes a configuration object as a parameter and then you can access to the schema by `Rakkit.MetadataStorage.Gql.Schema`.

In the configuration object you must provide a `resolvers` property, which can be an array of resolver classes:

```typescript
import {
  FirstResolver,
  SecondResolver
} from "../app/src/resolvers";
// ...
await Rakkit.start({
  gql: {
    resolvers: [FirstResolver, SampleResolver],
  }
});
```

However, when there are several resolver classes, manual imports can be cumbersome.
So we can also provide an array of paths to resolver module files instead, which can include globs:

```typescript
await Rakkit.start({
  gql: {
    resolvers: [__dirname + "/modules/**/*.resolver.ts", __dirname + "/resolvers/**/*.ts"],
  }
});
```

### Retrieve the schema
You can retrieve the schema using the Rakkit instance, after the `await Rakkit.start({ ... })` call:
```typescript
await Rakkit.start({
  gql: {
    resolvers: [__dirname + "/**/*.resolver.ts"],
  }
});

const schema = Rakkit.MetadataStorage.Gql.Schema;
```

To make `await` work, we need to declare it as an async function. Example of `main.ts` file:

```typescript
import { Rakkit } from "rakkit";

async function bootstrap() {
  await Rakkit.start({
    gql: {
      resolvers: [__dirname + "/**/*.resolver.ts"],
    }
  });

  const schema = Rakkit.MetadataStorage.Gql.Schema;
  // other initialization code, like creating http server
}

bootstrap(); // actually run the async function
```

## Create an HTTP GraphQL endpoint

In most cases, the GraphQL app is served by an HTTP server. After building the schema we can create the GraphQL endpoint with a variety of tools such as [`graphql-yoga`](https://github.com/prisma/graphql-yoga) or [`apollo-server`](https://github.com/apollographql/apollo-server). Here is an example using [`apollo-server`](https://github.com/apollographql/apollo-server):

```typescript
import { ApolloServer } from "apollo-server";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  // ... Building schema here

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    playground: true,
  });

  // Start the server
  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
```

Remember to install the `apollo-server` package from npm - it's not bundled with Rakkit.

Of course you can use the `express-graphql` middleware, `graphql-yoga` or whatever you want 😉

### Set the context
You can link Rakkit REST (koa app) and HTTP server to your apollo-server to have access to the entire context:

```typescript
import { ApolloServer } from "apollo-server";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  // ... Building schema here

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    playground: true,
    context: ({ ctx }) => ({
      ...ctx
    })
  });

  // Start the server
  server.applyMiddleware({
    app: Rakkit.Instance.KoaApp
  });

  // Uncomment if you want to enable subscriptions:
  // server.installSubscriptionHandlers(Rakkit.Instance.HttpServer);
}

bootstrap();
```