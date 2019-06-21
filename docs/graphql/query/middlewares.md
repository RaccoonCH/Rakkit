# Middlewares
Middleware are pieces of reusable code that can be easily attached to resolvers and fields. By using middleware we can extract the commonly used code from our resolvers and then declaratively attach it using a decorator or even registering it globally.

## Creating Middleware

### What is Middleware?

Middleware is a very powerful but somewhat complicated feature. Basically, middleware is a function that takes 2 arguments:

- the context (Request informations / GraphQL datas)
- the `next` function - used to control the execution of the next middleware and the resolver to which it is attached

We may be familiar with how middleware works in [`express.js`](https://expressjs.com/en/guide/writing-middleware.html) but Rakkit middleware is inspired by [`koa.js`](http://koajs.com/#application).

### Declaring a middleware

REST and GraphQL are both Rakkit packages and use the same routing engine, so the way to declare middleware is the same as for REST.   
Therefore you can **refer to the [documentation](/rest/middlewares)** made for REST middlewares to declare them for GraphQL.

### Attaching Middleware

To attach middleware to a resolver, place the `@UseMiddleware()` decorator above the field or resolver declaration. And pass you middlewares as parameters:
```typescript
@Resolver()
export class RecipeResolver {
  @Query()
  @UseMiddleware(ResolveTime, LogAccess)
  randomValue(): number {
    return Math.random();
  }
}
```

We can also attach the middleware to the `ObjectType` fields.

```typescript
@ObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field(type => [Int])
  @UseMiddleware(LogAccess)
  ratings: number[];
}
```

### Global Middleware

However, for common middleware like measuring resolve time or catching errors, it might be annoying to place a `@UseMiddleware(ResolveTime)` decorator on every field/resolver.

Hence, in Rakkit we can also register a global middleware that will be called for each query, mutation, subscription and field resolver. For this, we use the `globalMiddlewares` property of the `Rakkit.start` configuration object:

```typescript
await Rakkit.start({
  gql: {
    resolvers: [RecipeResolver],
    globalMiddlewares: [
      ErrorInterceptor,
      ResolveTime
    ],
  }
});
```
