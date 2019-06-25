---
title: Getting started
---

## Getting started
In order to start the application you will need to use the `Rakkit` class and access the static `start` method of it.  
Here is an example:
```typescript
import "reflect-metdata";
import { Rakkit } from "rakkit";

Rakkit.start();
```

## Start parameters
You can pass several parameters when starting the application in the `start` method to configure it.  

### Root parameters

| Property | Value | default | Description |
| --- | --- | --- | --- |
| silent | `boolean` | `false` | Never write anything in the console |
| host | `string` | `localhost` | The hostname |
| port | `number` | `4000` | The port number |
| forceStart | `("rest" | "gql" | "http" | "ws")[]` | `[]` (auto) | Force Rakkit to start the specified modules |
| rest | `IRestConfig` | `{ ... }` | [Config details](#rest-parameters) |
| gql | `IGqlConfig` | `{ ... }` | [Config details](#graphql-parameters) |
| ws | `IWsConfig` | `{ ... }` | [Config details](#ws-parameters) |
| routing | `IRoutingConfig` | `{ ... }` | [Config details](#routing-parameters) |

### GraphQL parameters

| Property | Value | default | Description |
| --- | --- | --- | --- |
| resolvers | `ClassOrString[]` | `[]` | The resolver class list or glob strings |
| globalMiddlewares | `MiddlewareType[]` | `[]` | The list of the global middlewares |
| globalMiddlewaresExclude | `string[]` | `[]` | Don't apply globalMiddlewares for some types of fields |
| nullableByDefault | `boolean` | `false` | Tell to Rakkit to make all fields nullable by default |
| inArrayNullableByDefault | `boolean` | `false` | Tell to Rakkit to make all depth of a multi-dimensional array nullable by default |
| scalarsMap | `IScalarAssociation[]` | `[]` | Link a class to a scalar graphql type. More details [here](/graphql/type/scalars/#custom-scalars). |
| dateMode | `"isoDate" | "timestamp"` | `"isoDate"` | The GraphQL scalar type that is associated to the Date type |
| pubSub | `PubSubEngine` | `new PubSub()` (from [graphql-subscriptions](https://github.com/apollographql/graphql-subscriptions)) | Your custom PubSub engine instance  |
| emitSchemaFile | `string` | `undefined` | Write the schema file in SDL to the specified path |

### REST parameters

| Property | Value | default | Description |
| --- | --- | --- | --- |
| routers | `ClassOrString[]` | `[]` | The router class list or glob strings |
| endpoint | `string` | `"/rest"` | The list of global the middlewares |
| globalRestMiddlewares | `MiddlewareType[]` | `[]` | Global middlewares that are applied to the `"/rest"` koa-router instance |
| globalRootMiddlewares | `MiddlewareType[]` | `[]` | Global middlewares that are applied to the `"/"` koa-router instance |
| globalAppMiddlewares | `MiddlewareType[]` | `[]` | Global middlewares that are applied directly on the main koa app instance |

### WS parameters

| Property | Value | default | Description |
| --- | --- | --- | --- |
| websockets | `ClassOrString[]` | `[]` | The websocket class list or glob strings |
| options | `ServerOptions` | `{path:"/ws"}` | Socket.io options to configure the server |

### Routing parameters

| Property | Value | default | Description |
| --- | --- | --- | --- |
| globalMiddlewares | `ClassOrString[]` | `[]` | The list of global the middlewares that are applied on **REST and GraphQL** |
