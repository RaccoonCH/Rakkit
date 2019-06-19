---
title: Enums
---

# Enums

Nowadays almost all typed languages have support for enumerated types, including TypeScript. Enums limit the range of a variable's values to a set of predefined constants, which makes it easier to document intent.

GraphQL also has enum type support, so Rakkit allows us to use TypeScript enums in our GraphQL schema.

## Usage

Let's create a TypeScript enum. It can be a numeric or string enum - the internal values of enums are taken from the enum definition values and the public names taken from the enum keys:

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
// or
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

You must create your enum type by using `TypeCreator.CreateEnum` method e.g.:

```typescript
import { TypeCreator } from "rakkit";

TypeCreator.CreateEnum(Direction, {
  name: "Direction", // this one is mandatory
  description: "The basic directions", // this one is optional
});
```

The last step is very important: TypeScript has limited reflection ability, so this is a case where we have to explicitly provide the enum type for object type fields, input type fields, args, and the return type of queries and mutations:

```typescript
@InputType()
class JourneyInput {
  @Field(type => Direction) // it's very important
  direction: Direction;
}
```

Without this annotation, the generated GQL type would be `String` or `Float` (depending on the enum type), rather than the `ENUM` we are aiming for.

With all that in place, we can use our enum directly in our code 😉

```typescript
class Resolver {
  private sprite = getMarioSprite();

  @Mutation()
  move(@Arg("direction", type => Direction) direction: Direction): boolean {
    switch (direction) {
      case Direction.Up:
        this.sprite.position.y++;
        break;
      case Direction.Down:
        this.sprite.position.y--;
        break;
      case Direction.Left:
        this.sprite.position.x--;
        break;
      case Direction.Right:
        this.sprite.position.x++;
        break;
      default:
        // it will never be hitten ;)
        return false;
    }

    return true;
  }
}
```

## Class based enum
With the method seen above it's not possible to describe the fields (deprecation, description). Therefore an alternative is provided to solve this problem. By using classes e.g. :

```typescript
@EnumType()
abstract class Direction {
  @EnumField("UP")
  Up: string

  @EnumField("DOWN")
  Down: string

  @EnumField("LEFT")
  Left: string

  @EnumField("RIGHT")
  Right: string
}
```

And use it like this:

```typescript
@InputType()
class JourneyInput {
  @Field()
  direction: Direction;
}
```

The disadvantage is that in our application we cannot use this class as a real enum, for example to access the values associated with the fields.

*Based on the **[TypeGraphQL](https://github.com/19majkel94/type-graphql)**'s documentation - Copyright (c) 2018 Michał Lytek*
