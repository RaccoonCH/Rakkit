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
    <a href="https://bundlephobia.com/result?p=rakkit@latest">
      <img src="https://badgen.net/bundlephobia/min/rakkit">
    </a>
    <a href="https://gitter.im/_rakkit_/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge">
      <img src="https://badges.gitter.im/_rakkit_/community.svg">
    </a>
  </p>
</center>

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
