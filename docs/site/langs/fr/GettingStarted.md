<center>
  <img src="./assets/logo.png" width="220" alt="Rakkit logo"/>
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

# Commencer

### Installation
Vous pouvez simplement installer **Rakkit** avec `npm` ou `yarn`.
```
npm i rakkit
```
```
yarn add rakkit
```

### reflect-metadata et décorateur
Pour utiliser Rakkit, et également pour toute les application en TS utilisant les décorateur vous devrez installer reflect-metadata et l'inclure dans le fichier de démarrage de votre application.
```
npm i reflect-metadata
```
```
yarn add reflect-metadata
```

Il faut également que déclariez dans le fichier tsconfig.json que vous utilisez les décorateurs:  
```javascript
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

### Démarrer l'application
Afin de démarrer l'application vous devrez utiliser la classe `Rakkit` et acceder à la méthode static `start` de celui-ci.  
Voici un exemple:
```javascript
import "reflect-metdata";
import { Rakkit } from "rakkit";

Rakkit.start();
```

### Paramètres de démarrage
Vous pouvez passer plusieurs paramètres lors du démarrage de l'application dans la méthode `start` afin de la configurer.

| Property | Value | default | Description |
| --- | --- | --- | --- |
| silent | `boolean?` | `false` | Ne jamais rien écrire dans la console |
| host | `string?` | `localhost` | Le nom d'hôte
| port | `number?` | `4000` | Le numero du port
| restEndpoint | `string?` | `"/rest"` | Le chemin d'accès de l'api REST
| socketioOptions | `WsOptions?` | `path: "/ws"` | Paramètrage de Socket.io (socket.io)
| routers | `ClassOrString[]?` | `undefined` | Une liste chemins représentants les fichiers de routers ([glob](https://github.com/isaacs/node-glob)) ou une liste de classes de routers
| websockets | `ClassOrString[]?` | `undefined` | Une liste chemins représentants les fichiers de websockets ([glob](https://github.com/isaacs/node-glob)) ou une liste de classes de websockets
| globalRestMiddlewares | `MiddlewareType[]?` | `undefined` | Une liste de middlewares globaux pour l'api REST (classes ou fonctions)
| globalRootMiddlewares | `MiddlewareType[]?` | `undefined` | Une liste de middlewares globaux pour le router principal (`"/"`) (classes ou fonctions)
| appMiddlewares | `MiddlewareType[]?` | `undefined` | Une liste de middlewares globaux sur l'application Koa
