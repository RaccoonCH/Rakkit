# REST & GraphQL & WebSocket & HTTP in one server

In this folder is a "clonable" project showing how to run in one Rakkit server:

- REST
- GraphQL
- Websocket
- HTTP

If you want to start using it for your own project, just copy this whole folder as your project folder and start adding your code to it.

This example is based on the examples [basic](https://github.com/RaccoonCH/Rakkit/tree/master/examples/basic) and [graphql/simple-usage](https://github.com/RaccoonCH/Rakkit/tree/master/examples/graphql/simple-usage) from Rakkit.

## Starting this example

If you use npm then you need to

- npm install
- npm start

If you use yarn then you need to

- yarn
- yarn start

in this example's folder.

## Why ts-node with tsconfig-paths

Because all imports are relative to baseUrl (from tsconfig.json) and ts-node does not support it by default, we need to use tsconfig-paths.

## Testing it

You find an export for [Insomnia v4](https://insomnia.rest/) so you can use it for testing from Insomnia.

### Testing REST

GET http://localhost:4000/rest/example

POST http://localhost:4000/rest/example

```json
{
  "a": "b"
}
```

### Testing GraphQL

POST http://localhost:4000/graphql

```json
query q {
  recipes {
    title
    description
    ratings
    creationDate
    ratingsCount
    averageRating
  }
}
```

### Testing Websocket

???

### Testing HTTP

GET http://localhost:4000/
