---
title: Installation
---

<center>
  <img src="/logo.png" width="220" alt="Rakkit logo"/>
  <p align="center">
    <a href="https://www.npmjs.com/package/rakkit">
      <img src="https://badge.fury.io/js/rakkit.svg">
    </a>
    <a href="https://travis-ci.com/RaccoonCH/Rakkit">
      <img src="https://travis-ci.com/RaccoonCH/Rakkit.svg?branch=master"/>
    </a>
    <a href="https://codecov.io/gh/RaccoonCH/Rakkit">
      <img src="https://codecov.io/gh/RaccoonCH/Rakkit/branch/master/graph/badge.svg" />
    </a>
    <a href="https://david-dm.org/RaccoonCH/Rakkit">
      <img src="https://david-dm.org/RaccoonCH/Rakkit.svg">
    </a>
    <a href="https://gitter.im/_rakkit_/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge">
      <img src="https://badges.gitter.im/_rakkit_/community.svg">
    </a>
  </p>
</center>

# Getting started

## Installation
You can simply install **Rakkit** with `npm` or `yarn`.
```
npm i rakkit
```
```
yarn add rakkit
```

## Decorators and reflect-metadata
To use Rakkit, and also for all TS applications using decorators you will need to install reflect-metadata and include it in your application's start file.
```
npm i reflect-metadata
```
```
yarn add reflect-metadata
```

You must also declare in the tsconfig.json file that you are using decorators:  
```typescript
{
  "compilerOptions": {
    "emitDecoratorMetadata": true, // <-
    "experimentalDecorators": true, // <-
    "module": "commonjs",
    "target": "es2016",
    "noImplicitAny": false,
    "sourceMap": true,
    "outDir": "build",
    "declaration": true,
    "importHelpers": true,
    "forceConsistentCasingInFileNames": true,
    "lib": [
      "es2016",
      "esnext.asynciterable"
    ],
    "moduleResolution": "node"
  }
}

```

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
| silent | `boolean?` | `false` | Never write anything in the console |
| host | `string?` | `localhost` | The hostname |
| port | `number?` | `4000` | The port number |
| restEndpoint | `string?` | `"/rest"` | the REST endpoint |
| socketioOptions | `WsOptions?` | `path: "/ws"` | Setting up Socket.io |
| routers | `ClassOrString[]?` | `undefined` | A list of paths representing the routers files ([glob](https://github.com/isaacs/node-glob)) or a list of routers classes |
| websockets | `ClassOrString[]?` | `undefined` | A list of paths representing the websockets files ([glob](https://github.com/isaacs/node-glob)) or a list of websockets classes |
| globalRestMiddlewares | `MiddlewareType[]?` | `undefined` | A list of global middleware for l'api REST (class or functions) |
| globalRootMiddlewares | `MiddlewareType[]?` | `undefined` | A list of global middleware for the root router (`"/"`) (class or functions) |
| appMiddlewares | `MiddlewareType[]?` | `undefined` | A list of global middleware on the Koa application |
