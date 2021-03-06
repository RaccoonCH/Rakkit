---
title: Interfaces
---

# Interfaces

The main idea of Rakkit is to create GraphQL types based on TypeScript classes.

In object-oriented programming it is common to create interfaces which describe the contract that classes implementing them must adhere to. Hence, Rakkit supports defining GraphQL interfaces.

Read more about the GraphQL **Interface Type** in the [official GraphQL docs](https://graphql.org/learn/schema/#interfaces).

## Usage

TypeScript has first class support for interfaces. Unfortunately, they only exist at compile-time, so we can't use them to build GraphQL schema at runtime by using decorators.

Luckily, we can use an abstract class for this purpose. It behaves almost like an interface - it can't be "newed" but it can be implemented by the class - and it just won't prevent developers from implementing a method or initializing a field. So, as long as we treat it like an interface, we can safely use it.

How do we create a GraphQL interface definition? We create an abstract class and decorate it with the `@InterfaceType()` decorator. The rest is exactly the same as with object types: we use the `@Field` decorator to declare the shape of the type:

```typescript
@InterfaceType()
abstract class IPerson {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field(type => Int)
  age: number;
}
```

We can then we use this "interface" in the object type class definition:

```typescript
@ObjectType({ implements: IPerson })
class Person implements IPerson {
  id: string;
  name: string;
  age: number;
}
```

The only difference is that we have to let Rakkit know that this `ObjectType` is implementing the `InterfaceType`. We do this by passing the param `({ implements: IPerson })` to the decorator. If we implement multiple interfaces, we pass an array of interfaces like so: `({ implements: [IPerson, IAnimal, IMachine] })`.

We can also omit the decorators since the GraphQL types will be copied from the interface definition - this way we won't have to maintain two definitions and solely rely on TypeScript type checking for correct interface implementation.

## Resolving Type

Be aware that when our object type is implementing a GraphQL interface type, **we have to return an instance of the type class** in our resolvers. Otherwise, `graphql-js` will not be able to detect the underlying GraphQL type correctly.

We can also provide our own `resolveType` function implementation to the `@InterfaceType` options (available too for TypeCreator.CreateUnion). This way we can return plain objects in resolvers and then determine the returned object type by checking the shape of the data object, the same ways [like in unions](/graphql/type/unions/#resolving-type).

But **Rakkit automatically determines** the type using instanceof if you return a class instance. However, if a plain-object is returned it will find the type thanks to the different fields provided.

If you have a special case you can provide the resolveType function like this:

```typescript
@InterfaceType({
  resolveType: (value) => {
    if ("grades" in value) {
      return "Student"; // schema name of the type as a string
    }
    return Person; // or the object type class
  }
})
abstract class IPerson {
  // ...
}
```
