---
title: Introduction
sidebar_label: What & Why
---

# Introduction

We all love GraphQL! It's really great and solves many problems that we have with REST APIs, such as overfetching and underfetching. But developing a GraphQL API in Node.js with TypeScript is sometimes a bit of a pain.

Rakkit's GraphQL Package works basically the same way as [TypeGraphQL](https://github.com/19majkel94/type-graphql) does (but it's not the same code base). So this documentation is based on theirs.

## What?

**Rakkit** is a library that makes this process enjoyable by defining the schema using only classes and a bit of decorator magic.
Example object type:

```typescript
@ObjectType()
class Recipe {
  @Field()
  title: string;

  @Field(type => [Rate])
  ratings: Rate[];

  @Field({ nullable: true })
  averageRating?: number;
}
```

It also has a set of useful features like middlewares and dependency injection, which helps develop GraphQL APIs quickly & easily!

## Why?

As mentioned, developing a GraphQL API in Node.js with TypeScript is sometimes a bit of a pain.
Why? Let's take a look at the steps we usually have to take.

First, we create all the schema types in SDL. We also create our data models using [ORM classes](https://github.com/typeorm/typeorm), which represent our database entities. Then we start to write resolvers for our queries, mutations and fields. This forces us, however, to begin with creating TypeScript interfaces for all arguments and inputs and/or object types. After that, we can actually implement the resolvers, using weird generic signatures, e.g.:

```typescript
export const getRecipesResolver: GraphQLFieldResolver<void, Context, GetRecipesArgs> = async (
  _,
  args,
  ctx,
) => {
  // common tasks repeatable for almost every resolver
  const auth = Container.get(AuthService);
  if (!auth.check(ctx.user)) {
    throw new NotAuthorizedError();
  }
  await joi.validate(getRecipesSchema, args);
  const repository = TypeORM.getRepository(Recipe);

  // our business logic, e.g.:
  return repository.find({ skip: args.offset, take: args.limit });
};
```

The biggest problem is code redundancy (DRY principle) which makes it difficult to keep things in sync. To add a new field to our entity, we have to jump through all the files: modify the entity class, then modify the schema, and finally update the interface. The same goes with inputs or arguments: it's easy to forget to update one of them or make a mistake with a type. Also, what if we've made a typo in a field name? The rename feature (F2) won't work correctly.

**Rakkit** comes to address these issues. The main idea is to have only one source of truth by defining the schema using classes and a bit of decorator help. Additional features like dependency injection and middlewares help with common tasks that would normally have to be handled by ourselves.

## Copyrights

This documentation is based on the **[TypeGraphQL](https://github.com/19majkel94/type-graphql)** documentation, because our framework works almost the same way. As a result, parts of it will be modified and others added. The name Rakkit can, in most cases, be replaced by TypeGraphQL.
*Copyright (c) 2018 Michał Lytek*
