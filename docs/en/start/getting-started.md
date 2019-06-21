---
title: Getting started
---

## Start the application
In order to start the application you will need to use the `Rakkit` class and access the static `start` method of it.  
Here is an example:
```typescript
import "reflect-metdata";
import { Rakkit } from "rakkit";

Rakkit.start();
```

## Start parameters
You can pass several parameters when starting the application in the `start` method to configure it.  

| Property | Value | default | Description |
| --- | --- | --- | --- |
| silent | `boolean` | `false` | Never write anything in the console |
| host | `string` | `localhost` | The hostname |
| port | `number` | `4000` | The port number |
| forceStart | `("rest" | "gql" | "http" | "ws")[]` | `[]` (auto) | Force Rakkit to start the specified modules |
| rest | `IRestConfig` | `{ ... }` | [Config details](/en/rest/config) |
| gql | `IGqlConfig` | `{ ... }` | [Config details](/en/gql/config) |
| ws | `IWsConfig` | `{ ... }` | [Config details](/en/ws/config) |
| routing | `IRoutingConfig` | `{ ... }` | [Config details](/en/routing/config) |