---
title: Emitting the schema SDL
---

# Emitting the schema SDL 

Rakkit's main feature is creating the schema using only TypeScript classes and decorators. However, there might be a need for the schema to be printed into a `schema.gql` file and there are plenty of reasons for that. Mainly, the schema SDL file is needed for GraphQL ecosystem tools that perform client-side queries autocompletion and validation. Some developers also may want to use it as a kind of snapshot for detecting schema regression or they just prefer to read the SDL file to explore the API instead of reading the complicated Rakkit-based app code, navigating through the GraphiQL or GraphQL Playground. To accomplish this demand, Rakkit allows you to create a schema definition file in two ways.

The first one is to generate it automatically on every build of the schema - just pass `emitSchemaFile: pathToFile` to the `Rakkit.start` options in order to emit the `schema.gql`.

```typescript
await Rakkit.start({
  gql: {
    resolvers: [ExampleResolver],
    emitSchemaFile: path.resolve(__dirname, "__snapshots__/schema/schema.gql")
  }
});
```
