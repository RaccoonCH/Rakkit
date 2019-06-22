---
title: Type Creator
---

# Type Creator
It is possible that sometimes you need to create GraphQL types that are not based on classes such as union, enum, partial or required types. **TypeCreator** is a class that will allow you to do this using static methods

## Partial
TypeScript provides generic types to change the fields in the class. Partial<...> allows you to make all the fields of a class nullable.
It is possible to use the same functionality with Rakkit in this way:

```typescript
@ObjectType()
class User {
  @Field()
  username: string;

  @Field()
  email: string;
}
```

All fields aren't nullable for the moment

```typescript
const nullableUser = TypeCreator.CreatePartial(User, {
  name: "NullableUser"
});
```

And you can simply use it as a type:

```typescript
@ObjectType()
class Post {
  @Field(type => nullableUser)
  user: Partial<User>;
}
```

## Required
It works the same way as for [Partial types](#partial) but the TypeCreator method is `TypeCreator.CreateRequired`

## Enums
The enum type documentation is available [here](/graphql/type/enums)

## Unions
The union type documentation is available [here](/graphql/type/unions)
